import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// NOTE: Firebase web config values are not secret — they identify your
// project to Firebase, they don't grant access on their own. Access control
// is enforced by your Firestore/Storage Security Rules, not by hiding this
// object. It's still good practice to load it from environment variables
// (see .env.example) so you can point different builds at different
// Firebase projects without touching code.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCLa36_JWogbkaDpGiADnBhggOTfzl7yTM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mp3-streaming-36475.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mp3-streaming-36475",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mp3-streaming-36475.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "244275616314",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:244275616314:web:9df7e45858328fdf0bf303",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1RZ5JJV0S3",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
