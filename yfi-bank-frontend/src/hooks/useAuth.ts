import { useState, useEffect } from 'react';
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types/common';
import { sanitizeObject } from '../utils/sanitizers';
import { api } from '../services/api';
import { ApiResponse } from '../types/common';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthHookResult {
  user: User | null;
  authUser: SupabaseUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<SupabaseUser | undefined>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthHookResult {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) throw error;

      const customUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        cpf: profile.cpf,
        phone: profile.phone,
        birthDate: profile.birth_date,
        address: {
          cep: profile.cep,
          street: profile.street,
          number: profile.number,
          complement: profile.complement || undefined,
          neighborhood: profile.neighborhood,
          city: profile.city,
          state: profile.state,
        },
      };

      const sanitizedUser = sanitizeObject(customUser) as User;
      setUserProfile(sanitizedUser);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserProfile(null);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setAuthUser(currentUser);

      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with Supabase
  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    console.log('Starting signUp function');

    // Set a timeout for the entire signup process
    const signupTimeout = 15000; // 15 seconds

    try {
      const signupResult = await Promise.race([
        (async () => {
          // Sign up with Supabase Auth
          const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
              email,
              password,
              options: {},
            });

          if (signUpError) {
            console.error('Supabase signUp error:', signUpError);
            throw signUpError;
          }

          console.log('Supabase signUp successful:', signUpData);

          // Insert user data into users table
          if (signUpData.user) {
            console.log('Calling backend to insert user data:', {
              id: signUpData.user.id,
              email: signUpData.user.email,
              name: userData.name,
              cpf: userData.cpf,
              phone: userData.phone,
              birthDate: userData.birthDate,
              address: userData.address,
            });

            // Set a timeout for the backend API call
            const apiTimeout = 10000; // 10 seconds
            const apiCall = api.post<ApiResponse>('/auth/insert-user', {
              id: signUpData.user.id,
              email: signUpData.user.email,
              name: userData.name,
              cpf: userData.cpf,
              phone: userData.phone,
              birthDate: userData.birthDate,
              address: userData.address,
            });

            const response = await Promise.race([
              apiCall,
              new Promise<never>((_, reject) =>
                setTimeout(
                  () => reject(new Error('API call timed out')),
                  apiTimeout
                )
              ),
            ]);

            if (response.data.error) {
              console.error('Error from backend:', response.data.error);
              throw new Error(response.data.error);
            }

            console.log('User data inserted successfully:', response.data);
            return signUpData.user;
          } else {
            console.error('No user data found after signup.');
            throw new Error('No user data found after signup.');
          }
        })(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Signup process timed out')),
            signupTimeout
          )
        ),
      ]);
      return signupResult;
    } catch (error) {
      console.error('Error during signup process:', error);
      throw error;
      return;
    }
  };

  // Log in with Supabase
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Log out with Supabase
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user: userProfile,
    authUser,
    loading,
    signUp,
    login,
    logout,
  };
}