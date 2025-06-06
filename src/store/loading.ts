import { create } from 'zustand';

type Store = {
  isLoading: boolean;
  setIsLoading: () => void;
};

export const useLoadingStore = create<Store>((set) => ({
  isLoading: false,
  setIsLoading: () => set((s) => ({ isLoading: !s.isLoading })),
}));