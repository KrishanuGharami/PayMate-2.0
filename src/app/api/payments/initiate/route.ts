import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { redis } from '@/lib/redis';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().positive(),
  recipient: z.string(),
  idempotencyKey: z.string().uuid(),
  userId: z.string()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = paymentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload', details: result.error.errors }, { status: 400 });
    }

    const { amount, recipient, idempotencyKey, userId } = result.data;

    // 1. Idempotency Check using Redis
    // If the key exists, it means we already processed or are processing this request
    const existingTransaction = await redis.get(`tx_${idempotencyKey}`);
    if (existingTransaction) {
      return NextResponse.json({ 
        message: 'Transaction already processed', 
        transaction: existingTransaction 
      }, { status: 200 });
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
