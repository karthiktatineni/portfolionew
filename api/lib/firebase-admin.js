import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

function initFirebaseAdmin() {
    if (getApps().length > 0) {
        return getFirestore();
    }

    // Diagnostics
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            initializeApp({
                credential: cert(serviceAccount)
            });
            return getFirestore();
        } catch (error) {
            console.error('[Firebase Admin] Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', error);
            throw error;
        }
    }

    if (!projectId) {
        console.error('[Firebase Admin] Missing VITE_FIREBASE_PROJECT_ID or FIREBASE_PROJECT_ID');
    }
    if (!clientEmail) {
        console.error('[Firebase Admin] Missing FIREBASE_CLIENT_EMAIL');
    }
    if (!privateKey) {
        console.error('[Firebase Admin] Missing FIREBASE_PRIVATE_KEY');
    }

    if (projectId && clientEmail && privateKey) {
        try {
            initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    // Replace escaped newlines with actual newlines
                    privateKey: privateKey.replace(/\\n/g, '\n')
                })
            });
            return getFirestore();
        } catch (error) {
            console.error('[Firebase Admin] Initialization error:', error);
            throw error;
        }
    } else {
        throw new Error('Firebase Admin initialization failed due to missing credentials.');
    }
}

// Export the singleton db instance and FieldValue/Timestamp for utility
const db = initFirebaseAdmin();

export { db, FieldValue, Timestamp };
