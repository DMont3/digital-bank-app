import { create } from 'zustand';
import { persist, StateStorage } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (isOpen: boolean) => void;
}

const storage = {
  getItem: async (name: string) => {
    const value = localStorage.getItem(name);
    if (value) {
      const parsed = JSON.parse(value);
      return {
        state: parsed.state,
        version: parsed.version
      };
    }
    return null;
  },
  setItem: async (name: string, value: { state: SidebarStore; version?: number }) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setSidebar: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'sidebar-storage',
      storage,
    }
  )
);
