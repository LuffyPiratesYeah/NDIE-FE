import { create } from "zustand";

interface AuthState {
  uid: string | null;
  email: string | null;
  role: "ADMIN" | "USER" | null;
  isLoading: boolean;
  isInitialized: boolean;
  setAuth: (uid: string | null, email: string | null, role: "ADMIN" | "USER" | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  email: null,
  role: null,
  isLoading: true,
  isInitialized: false,
  setAuth: (uid, email, role) => set({ uid, email, role }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clear: () => set({ uid: null, email: null, role: null }),
}));
