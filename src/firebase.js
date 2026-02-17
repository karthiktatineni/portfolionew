import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Helper to check if env vars are loaded
const isConfigured = import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== 'your-api-key';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if config is present
let app;
let db;

try {
    if (isConfigured) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("Firebase initialized successfully");
    } else {
        console.warn("Firebase credentials missing in .env file. Contact form will essentially mock success.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { db };
