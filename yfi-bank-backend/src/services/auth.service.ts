import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env'
import { CreateUserDTO, LoginDTO, AuthResponse, UserProfile } from '../models/user.model'

export class AuthService {
  private supabase

  constructor() {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey)
  }

  public async createUserProfile(userId: string, userData: CreateUserDTO): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        id: userId,
        email: userData.email,
        name: userData.name,
        cpf: userData.cpf,
        phone: userData.phone,
        birth_date: userData.birthDate,
        address: userData.address,
        email_verified: true,
        phone_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      // Em caso de erro, deletamos o usuário do Auth
      await this.supabase.auth.admin.deleteUser(userId)
      throw error
    }

    return data
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (authError) throw authError
    if (!authData.user) {
      throw new Error('Authentication failed')
    }

    const userProfile = await this.getUserProfile(authData.user.id)
    return {
      user: userProfile,
      session: authData.session
    }
  }

  async logout(token: string) {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(token: string): Promise<UserProfile> {
    const { data: { user }, error } = await this.supabase.auth.getUser(token)
    if (error || !user) {
      throw error || new Error('Invalid token')
    }
    return await this.getUserProfile(user.id)
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  async verifyEmail(token: string) {
    const { error } = await this.supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    })

    if (error) throw error

    // Atualizar status de verificação de email no perfil
    const { data: { user } } = await this.supabase.auth.getUser()
    if (user) {
      await this.supabase
        .from('users')
        .update({ email_verified: true })
        .eq('id', user.id)
    }
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  }
}