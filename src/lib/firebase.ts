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

// Initialize Firebase App (싱글톤)
let app: FirebaseApp;
if (typeof window !== 'undefined') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log('[Firebase] App 초기화 완료:', app.name);
  } catch (error) {
    console.error('[Firebase] App 초기화 실패:', error);
    throw error;
  }
} else {
  app = {} as FirebaseApp;
}

// Initialize Auth
let auth: Auth | any;
if (typeof window !== 'undefined') {
  try {
    auth = getAuth(app);
    console.log('[Firebase] Auth 초기화 완료');
  } catch (error) {
    console.error('[Firebase] Auth 초기화 실패:', error);
    auth = {} as any;
  }
} else {
  auth = {} as any;
}

// Initialize Firestore
let db: Firestore | any;
if (typeof window !== 'undefined') {
  try {
    db = getFirestore(app);
    console.log('[Firebase] Firestore 초기화 완료');

    // 연결 테스트
    import('firebase/firestore').then(({ collection, getDocs, limit, query }) => {
      const testQuery = query(collection(db, 'QNA'), limit(1));
      getDocs(testQuery)
        .then(() => console.log('[Firebase] Firestore 연결 테스트 성공 ✅'))
        .catch((err) => console.error('[Firebase] Firestore 연결 테스트 실패 ❌:', err));
    });
  } catch (error) {
    console.error('[Firebase] Firestore 초기화 실패:', error);
    db = {} as any;
  }
} else {
  db = {} as any;
}

// Initialize Storage
let storage: any;
if (typeof window !== 'undefined') {
  try {
    storage = getStorage(app);
    console.log('[Firebase] Storage 초기화 완료');
  } catch (error) {
    console.error('[Firebase] Storage 초기화 실패:', error);
    storage = {} as any;
  }
} else {
  storage = {} as any;
}

export { app, auth, db, storage };

export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};
