import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
  setToken: (token: string | null) => void;
  setRole: (role: 'ADMIN' | 'USER' | null) => void;
  setUser: (token: string | null, role: 'ADMIN' | 'USER' | null) => void;
}

// 서버사이드에서 안전한 스토리지
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setUser: (token, role) => set({ token, role }),
    }),
    {
      name: 'auth-token',
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
    }
  )
);
