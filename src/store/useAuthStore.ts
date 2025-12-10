import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
  setToken: (token: string | null) => void;
  setRole: (role: 'ADMIN' | 'USER' | null) => void;
  setUser: (token: string | null, role: 'ADMIN' | 'USER' | null) => void;
}

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
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
        }
      ),
    }
  )
);
