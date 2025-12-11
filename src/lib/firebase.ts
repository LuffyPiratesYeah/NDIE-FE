import type { FirebaseStorage } from "firebase/storage";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCfRb2YUW104q4GMnWe-sWySwbpkkGztrA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ndie-home.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ndie-home",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ndie-home.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "634489385174",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:634489385174:web:7da4a2a0adb158504a9977",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XYVNNJM4G4"
};

// Cached instances
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
};

// 동적 초기화 함수들
export const getFirebaseApp = async (): Promise<FirebaseApp | null> => {
  if (!isBrowser()) return null;
  if (_app) return _app;
  
  const { initializeApp, getApps, getApp } = await import("firebase/app");
  _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return _app;
};

export const getFirebaseAuth = async (): Promise<Auth | null> => {
  if (!isBrowser()) return null;
  if (_auth) return _auth;
  
  const app = await getFirebaseApp();
  if (!app) return null;
  
  const { getAuth } = await import("firebase/auth");
  _auth = getAuth(app);
  return _auth;
};

export const getFirebaseDb = async (): Promise<Firestore | null> => {
  if (!isBrowser()) return null;
  if (_db) return _db;
  
  const app = await getFirebaseApp();
  if (!app) return null;
  
  const { getFirestore } = await import("firebase/firestore");
  _db = getFirestore(app);
  return _db;
};

export const getFirebaseStorage = async (): Promise<FirebaseStorage | null> => {
  if (!isBrowser()) return null;
  if (_storage) return _storage;
  
  const app = await getFirebaseApp();
  if (!app) return null;
  
  const { getStorage } = await import("firebase/storage");
  _storage = getStorage(app);
  return _storage;
};

// 기존 코드 호환성을 위한 동기 export (deprecated - 비동기 함수 사용 권장)
// 이 값들은 항상 null이며, 실제 사용 시 동적 import 필요
export const app: FirebaseApp | null = null;
export const auth: Auth | null = null;
export const db: Firestore | null = null;
export const storage: FirebaseStorage | null = null;

// Analytics
export const initAnalytics = async (): Promise<Analytics | null> => {
  if (!isBrowser()) return null;
  
  const app = await getFirebaseApp();
  if (!app) return null;
  
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  const supported = await isSupported();
  if (supported) {
    return getAnalytics(app);
  }
  return null;
};
