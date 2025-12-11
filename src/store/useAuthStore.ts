import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
  setToken: (token: string | null) => void;
  setRole: (role: 'ADMIN' | 'USER' | null) => void;
  setUser: (token: string | null, role: 'ADMIN' | 'USER' | null) => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  },
  setRole: (role) => {
    set({ role });
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('role', role);
      } else {
        localStorage.removeItem('role');
      }
    }
  },
  setUser: (token, role) => {
    set({ token, role });
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
      if (role) {
        localStorage.setItem('role', role);
      } else {
        localStorage.removeItem('role');
      }
    }
  },
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') as 'ADMIN' | 'USER' | null;
      set({ token, role });
    }
  },
}));
