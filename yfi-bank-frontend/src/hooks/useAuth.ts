import { useState, useEffect } from 'react'
import { createClient, User as SupabaseUser } from '@supabase/supabase-js'
import { User, CreateUserDTO } from '../types/common'
import { sanitizeObject } from '../utils/sanitizers'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function useAuth() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Função para buscar e sanitizar dados do usuário
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) throw error

      // Convert profile data to our custom User type
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
          state: profile.state
        }
      }

      // Sanitize the user data before setting it
      const sanitizedUser = sanitizeObject(customUser) as User
      setUserProfile(sanitizedUser)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      setUserProfile(null)
    }
  }

  useEffect(() => {
    // Recupera sessão atual
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null
        setAuthUser(currentUser)
        
        if (currentUser) {
          await fetchUserProfile(currentUser)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      setAuthUser(data.user)
      if (data.user) {
        await fetchUserProfile(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setAuthUser(null)
      setUserProfile(null)
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string, userData: CreateUserDTO) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      if (error) throw error
      
      setAuthUser(data.user)
      if (data.user) {
        await fetchUserProfile(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })
      if (error) throw error
      if (authUser) {
        await fetchUserProfile(authUser)
      }
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!authUser) throw new Error('User not authenticated')
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', authUser.id)
        .select()
        .single()
      if (error) throw error
      if (data) {
        const sanitizedUser = sanitizeObject(data) as User
        setUserProfile(sanitizedUser)
      }
    } catch (error) {
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      if (!authUser) throw new Error('User not authenticated')
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', authUser.id)
      if (profileError) throw profileError
      const { error: authError } = await supabase.auth.admin.deleteUser(authUser.id)
      if (authError) throw authError
      setAuthUser(null)
      setUserProfile(null)
    } catch (error) {
      throw error
    }
  }

  return {
    user: userProfile, // For backwards compatibility
    authUser, // Supabase auth user
    loading,
    login,
    logout,
    signup,
    resetPassword,
    verifyEmail,
    updateProfile,
    deleteAccount
  }
}
