import { useState, useEffect } from "react";
import { createClient, User as SupabaseUser } from "@supabase/supabase-js";
import { User, CreateUserDTO } from "../types/common";
import { useAuthStore, AuthUser } from "../stores/authStore";
import { sanitizeObject } from "../utils/sanitizers";
import api from "../services/api";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Função para buscar, sanitizar e atualizar dados do usuário
  const fetchAndUpdateUserProfile = async (
    supabaseUser: SupabaseUser
  ): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        throw new Error("Failed to fetch user profile");
      }

      if (!profile) {
        console.error(
          "Erro ao buscar perfil: Perfil do usuário não encontrado."
        );
        throw new Error("User profile not found");
      }

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
      
      // Update authStore with complete profile data
      const authUser: AuthUser = {
        ...supabaseUser,
        profile: sanitizedUser
      };
      
      // Ensure authStore is updated with complete user data
      useAuthStore.getState().setUser(authUser);
      
      // Update local storage with profile data
      localStorage.setItem('supabase.auth.profile', JSON.stringify(sanitizedUser));
      return true;
    } catch (error) {
      console.error("Erro ao buscar e atualizar perfil:", error);
      return false;
    }
  };

  // Verifica a sessão ao carregar a aplicação
  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verifica a sessão e usuário de forma atômica
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message || 'Erro ao buscar sessão');
      }

      // Atualiza estados de forma consistente
      if (session?.user && user) {
        if (authUser?.id !== user.id) {
          console.log('[useAuth] Setting authUser:', user);
          setAuthUser(user);
          
          // Ensure authStore is updated with complete user data
          console.log('[useAuth] Fetching and updating user profile');
          const profileFetched = await fetchAndUpdateUserProfile(user);
          if (!profileFetched) {
            throw new Error('Failed to fetch user profile');
          }
          
          // Update local storage with session data
          localStorage.setItem('supabase.auth.token', JSON.stringify(session));
        }
        return true;
      } else {
        if (authUser) {
          console.log('[useAuth] Clearing authUser');
          setAuthUser(null);
          useAuthStore.getState().reset();
        }
        if (userProfile) {
          console.log('[useAuth] Clearing userProfile');
          setUserProfile(null);
        }
        return false;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao verificar sessão'
      );
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let sessionInProgress = false;

    const initializeAuth = async () => {
      try {
        // Verifica a sessão ao montar o componente
        await checkSession();

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('[useAuth] onAuthStateChange event:', event);

          if (!mounted || sessionInProgress) return;

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            sessionInProgress = true;
            checkSession()
              .catch(console.error)
              .finally(() => {
                sessionInProgress = false;
              });
          } else if (event === 'SIGNED_OUT') {
            setAuthUser(null);
            setUserProfile(null);
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao inicializar autenticação'
        );
        console.error('Erro ao inicializar autenticação:', error);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(`Credenciais inválidas: ${error.message}`);
      }

      if (data?.user) {
        console.log('[useAuth] setAuthUser in login:', data.user);
        setAuthUser(data.user);
        
        // Ensure authStore is updated with complete user data
        console.log('[useAuth] fetchAndUpdateUserProfile in login');
        const profileFetched = await fetchAndUpdateUserProfile(data.user);
        if (!profileFetched) {
          throw new Error('Failed to fetch user profile');
        }
        
        // Update local storage with session data
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        
        return true;
      }
      return false;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      // Executa o logout no Supabase primeiro
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpa os estados após logout bem-sucedido
      setAuthUser(null);
      setUserProfile(null);
      
      // Limpa estados e redireciona forçando reload completo
      // Primeiro limpa o cache
      window.localStorage.clear();
      window.sessionStorage.clear();
      
      // Limpa o estado do store
      useAuthStore.getState().reset();
      
      // Força atualização dos componentes
      window.dispatchEvent(new Event('storage'));
      
      // Redireciona para home com reload forçado
      window.location.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    userData: CreateUserDTO
  ) => {
    try {
      const response = await api.post("/api/v1/signup", {
        ...userData,
        email,
        password,
      });
      if (response.status !== 201) {
        throw new Error(response.data.message || "Erro ao criar usuário");
      }
      return true; // Return true to indicate successful signup
    } catch (error) {
      console.error("Erro durante o signup:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });
      if (error) throw error;
      if (authUser) {
        await fetchAndUpdateUserProfile(authUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!authUser) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", authUser.id)
        .select()
        .single();
      if (error) throw error;
      if (data) {
        const sanitizedUser = sanitizeObject(data) as User;
        setUserProfile(sanitizedUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!authUser) throw new Error("User not authenticated");
      const { error: profileError } = await supabase
        .from("users")
        .delete()
        .eq("id", authUser.id);
      if (profileError) throw profileError;
      const { error: authError } = await supabase.auth.admin.deleteUser(
        authUser.id
      );
      if (authError) throw authError;
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
    error,
    login,
    logout,
    signup,
    resetPassword,
    verifyEmail,
    updateProfile,
    deleteAccount,
    isAuthenticating,
  };
}
