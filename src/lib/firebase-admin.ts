import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'paymate-mock-project';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'mock@example.com';
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----').replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    console.warn('Firebase admin initialization warning (likely during build):', error);
  }
}

// Check if initialized before exporting db, otherwise export a dummy or throw gracefully.
const app = admin.apps.length ? admin.app() : null;
const adminDb = app ? app.firestore() : null as unknown as admin.firestore.Firestore;
const adminAuth = app ? app.auth() : null as unknown as admin.auth.Auth;

export { adminDb, adminAuth };
