import { create } from 'zustand';

interface AppState {
  estimatedTotalAssets: number;
  setEstimatedTotalAssets: (amount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  estimatedTotalAssets: 0,
  setEstimatedTotalAssets: (amount) => set({ estimatedTotalAssets: amount }),
}));