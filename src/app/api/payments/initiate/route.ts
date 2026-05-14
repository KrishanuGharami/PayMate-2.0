import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { redis } from '@/lib/redis';
import { z } from 'zod';
import { detectFraud } from '@/ai/flows/fraud-detection-flow';
import { auth } from '@clerk/nextjs/server';
import { paymentRateLimit } from '@/lib/auth';

const paymentSchema = z.object({
  amount: z.number().positive(),
  recipient: z.string(),
  idempotencyKey: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    // 1. Session Verification via Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // 2. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await paymentRateLimit.limit(`payment_${userId}_${ip}`);
    if (!success) {
      return NextResponse.json({ error: 'Too many payment requests. Please slow down.' }, { status: 429 });
    }

    const body = await request.json();
    const result = paymentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload', details: result.error.errors }, { status: 400 });
    }

    const { amount, recipient, idempotencyKey } = result.data;

    // 3. Idempotency Check using Redis
    // If the key exists, it means we already processed or are processing this request
    const existingTransaction = await redis.get(`tx_${idempotencyKey}`);
    if (existingTransaction) {
      return NextResponse.json({ 
        message: 'Transaction already processed', 
        transaction: existingTransaction 
      }, { status: 200 });
    }

    // 1.5. Intelligent AI Fraud Detection (Phase 4)
    // Query past transactions to build a user profile
    const pastTransactions = await adminDb.collection('transactions')
      .where('userId', '==', userId)
      .where('status', '==', 'COMPLETED')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
      
    let totalAmount = 0;
    const recipientsSet = new Set<string>();
    
    pastTransactions.forEach(doc => {
        const data = doc.data();
        totalAmount += data.amount;
        recipientsSet.add(data.recipient);
    });

    const averageAmount = pastTransactions.size > 0 ? totalAmount / pastTransactions.size : 0;
    const commonRecipients = Array.from(recipientsSet);

    try {
        const fraudResult = await detectFraud({
            amount,
            recipientId: recipient,
            transactionTime: new Date().toISOString(),
            userHistory: {
                averageAmount,
                commonRecipients,
                unusualLocation: false // Can be expanded with real GeoIP logic
            }
        });

        if (fraudResult.isFraudulent) {
            return NextResponse.json({ 
                error: 'Transaction blocked by AI Security.', 
                reason: fraudResult.reason,
                riskScore: fraudResult.riskScore,
                isFraud: true
            }, { status: 403 });
        }
    } catch (fraudErr) {
        console.error("Fraud Check Failed (continuing with caution):", fraudErr);
    }

    // Lock the transaction early in Redis (expires in 10 minutes)
    await redis.set(`tx_${idempotencyKey}`, JSON.stringify({ status: 'PROCESSING', amount }), { ex: 600 });

    // 2. Create the initial pending transaction in Firestore
    const txRef = adminDb.collection('transactions').doc(idempotencyKey);
    await txRef.set({
      userId,
      amount,
      recipient,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 3. (Mock) Enqueue the task for robust background processing.
    // In production, you'd use Google Cloud Tasks or Upstash QStash here.
    // For now, we simulate async processing.
    simulateAsyncPayment(idempotencyKey, amount, userId);

    return NextResponse.json({ 
      status: 'QUEUED', 
      transactionId: idempotencyKey,
      message: 'Your payment is being processed.' 
    });

  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function simulateAsyncPayment(transactionId: string, amount: number, userId: string) {
  // Simulate network delay
  setTimeout(async () => {
    try {
      // Simulate 10% chance of random network failure
      const isSuccess = Math.random() > 0.1;
      
      const status = isSuccess ? 'COMPLETED' : 'FAILED';
      
      // Update Firestore
      await adminDb.collection('transactions').doc(transactionId).update({
        status,
        updatedAt: new Date().toISOString()
      });

      // Update Redis cache
      await redis.set(`tx_${transactionId}`, JSON.stringify({ status, amount }), { ex: 3600 }); // keep result for 1 hour

      console.log(`Payment ${transactionId} finished with status: ${status}`);
    } catch (err) {
      console.error(`Failed to process async payment ${transactionId}`, err);
    }
  }, 3000);
}
