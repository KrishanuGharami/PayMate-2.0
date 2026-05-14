import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { auth } from '@clerk/nextjs/server';

// Demo seed data shown when Firestore is unavailable or has no transactions
const SEED_TRANSACTIONS = [
  { id: 'seed_1', recipient: 'Starbucks', amount: 450, status: 'COMPLETED', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'Food & Drinks' },
  { id: 'seed_2', recipient: 'Ankit Sharma', amount: -2000, status: 'COMPLETED', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'Transfer' },
  { id: 'seed_3', recipient: 'Jio Recharge', amount: 239, status: 'COMPLETED', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), type: 'Bills' },
  { id: 'seed_4', recipient: 'Netflix', amount: 199, status: 'PENDING', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'Subscription' },
  { id: 'seed_5', recipient: 'Salary Credit', amount: -50000, status: 'COMPLETED', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'Credit' },
  { id: 'seed_6', recipient: 'Amazon', amount: 1500, status: 'COMPLETED', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'Shopping' },
  { id: 'seed_7', recipient: 'Zomato', amount: 350, status: 'FAILED', createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), type: 'Food' },
  { id: 'seed_8', recipient: 'Electricity Bill', amount: 1250, status: 'COMPLETED', createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), type: 'Bills' },
];

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try fetching from Firestore if admin SDK is properly configured
    if (adminDb) {
      try {
        const snapshot = await adminDb.collection('transactions')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();

        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If real transactions exist, return them
        if (transactions.length > 0) {
          return NextResponse.json({ transactions });
        }
      } catch (firestoreError) {
        console.warn("Firestore query failed, falling back to seed data:", firestoreError);
      }
    }

    // Fallback: return seed data for demo purposes
    return NextResponse.json({ transactions: SEED_TRANSACTIONS });
  } catch (error: any) {
    console.error("Fetch Transactions Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
