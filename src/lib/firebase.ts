import { getStorage, FirebaseStorage } from "firebase/storage";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCfRb2YUW104q4GMnWe-sWySwbpkkGztrA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ndie-home.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ndie-home",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ndie-home.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "634489385174",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:634489385174:web:7da4a2a0adb158504a9977",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XYVNNJM4G4"
};

// Lazy initialization - 실제 사용 시점에 초기화
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') return null;
  if (!_app) {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
};

// Getter functions for lazy initialization
export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === 'undefined') return null;
  if (!_auth) {
    const app = getFirebaseApp();
    if (app) _auth = getAuth(app);
  }
  return _auth;
};

export const getFirebaseDb = (): Firestore | null => {
  if (typeof window === 'undefined') return null;
  if (!_db) {
    const app = getFirebaseApp();
    if (app) _db = getFirestore(app);
  }
  return _db;
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (typeof window === 'undefined') return null;
  if (!_storage) {
    const app = getFirebaseApp();
    if (app) _storage = getStorage(app);
  }
  return _storage;
};

// 기존 코드 호환성을 위한 getter
export const app = typeof window !== 'undefined' ? getFirebaseApp() : null;
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirebaseDb() : null;
export const storage = typeof window !== 'undefined' ? getFirebaseStorage() : null;

// Analytics
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const app = getFirebaseApp();
    if (app) {
      const supported = await isSupported();
      if (supported) {
        return getAnalytics(app);
      }
    }
  }
  return null;
};
