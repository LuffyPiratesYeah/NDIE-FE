"use client";

import { getStorage } from "firebase/storage";
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

// 클라이언트 사이드에서만 Firebase 초기화
const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') return null;
  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

const app = getFirebaseApp();

// Auth
export const auth: Auth | null = app ? getAuth(app) : null;

// Firestore
export const db: Firestore | null = app ? getFirestore(app) : null;

// Storage
export const storage = app ? getStorage(app) : null;

// Analytics
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && app) {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export { app };
