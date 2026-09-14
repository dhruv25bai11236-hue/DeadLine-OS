import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDLCUnpLh_QUfYwvPrr79L2bA2oM1Z-IKI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "deadlineos-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "deadlineos-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "deadlineos-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "717848133424",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:717848133424:web:6568408b39ac83605952f5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VGQ2T5FES7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);