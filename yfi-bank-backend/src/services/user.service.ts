import { createClient } from '@supabase/supabase-js'
import { UserProfile } from '../models/user.model'

export class UserService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    )
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as UserProfile
  }

  async updateProfile(userId: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as UserProfile
  }

  async deleteAccount(userId: string): Promise<void> {
    // Deletar perfil do usuário
    const { error: profileError } = await this.supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (profileError) throw profileError

    // Deletar usuário do auth
    const { error: authError } = await this.supabase.auth.admin.deleteUser(userId)
    if (authError) throw authError
  }
}