import { create } from 'zustand';

import { User } from '../types/common';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type AuthUser = SupabaseUser & {
  profile: User;
};

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  reset: () => void;
}

const getInitialState = (): AuthState => {
  const storedSession = localStorage.getItem('supabase.auth.token');
  const storedProfile = localStorage.getItem('supabase.auth.profile');
  
  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    setUser: () => {},
    reset: () => {},
  };

  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      const user = session?.currentSession?.user || null;
      
      if (user && storedProfile) {
        const profile = JSON.parse(storedProfile);
        initialState.user = {
          ...user,
          profile
        };
        initialState.isAuthenticated = true;
      } else if (user) {
        initialState.user = user;
        initialState.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Failed to parse stored session:', error);
    }
  }
  return initialState;
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  setUser: (user) => {
    if (user?.profile) {
      localStorage.setItem('supabase.auth.profile', JSON.stringify(user.profile));
    }
    set({ user, isAuthenticated: !!user });
  },
  reset: () => {
    localStorage.removeItem('supabase.auth.profile');
    set(getInitialState());
  }
}));

export const { reset } = useAuthStore.getState();
