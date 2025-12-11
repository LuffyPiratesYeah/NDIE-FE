"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading, setInitialized, clear } = useAuthStore();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const { getFirebaseAuth, getFirebaseDb } = await import("@/lib/firebase");
        const { onAuthStateChanged } = await import("firebase/auth");
        const { doc, getDoc } = await import("firebase/firestore");

        const auth = await getFirebaseAuth();
        if (!auth) {
          setLoading(false);
          setInitialized(true);
          return;
        }

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Firestore에서 role 가져오기
            let role: "ADMIN" | "USER" = "USER";
            try {
              const db = await getFirebaseDb();
              if (db) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                  role = userDoc.data().role === "ADMIN" ? "ADMIN" : "USER";
                }
              }
            } catch (e) {
              console.error("Failed to fetch user role:", e);
            }
            setAuth(user.uid, user.email, role);
          } else {
            clear();
          }
          setLoading(false);
          setInitialized(true);
        });
      } catch (e) {
        console.error("Auth init error:", e);
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setAuth, setLoading, setInitialized, clear]);

  return <>{children}</>;
}
