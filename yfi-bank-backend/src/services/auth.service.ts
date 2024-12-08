import { createClient } from '@supabase/supabase-js'
import { AuthResponse, CreateUserDTO, LoginDTO, User } from '../models/user.model'

export class AuthService {
  private supabase

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa a service_role key
    )
  }

  async sendEmailVerification(email: string) {
    // Primeiro remove usuários não confirmados com o mesmo email
    const { data: users, error: usersError } = await this.supabase.auth.admin
      .listUsers()

    if (!usersError) {
      const unconfirmedUsers = users.users.filter(
        user => user.email === email && !user.email_confirmed_at
      )

      for (const user of unconfirmedUsers) {
        await this.supabase.auth.admin.deleteUser(user.id)
      }
    }

    // Envia novo código
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/verify-email`
      }
    })

    if (error) throw error

    // Não retorna AuthResponse pois é apenas um passo intermediário
    return { message: 'Verification email sent' }
  }

  async verifyEmailCode(email: string, code: string) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email'
    })

    if (error) throw error

    // Não retorna AuthResponse pois é apenas uma verificação
    return { message: 'Email verified successfully' }
  }

  async register(userData: CreateUserDTO): Promise<AuthResponse> {
    // Primeiro, verifica se o email já foi confirmado
    const { data: existingUser } = await this.supabase.auth.admin
      .listUsers()
      .then(({ data }) => ({
        data: data.users.find(u => u.email === userData.email && u.email_confirmed_at)
      }));

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Registrar usuário no Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone
        }
      }
    });

    if (authError) throw authError;

    try {
      // Inserir dados do usuário na tabela users
      const { data: profileData, error: profileError } = await this.supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: userData.email,
          name: userData.name,
          cpf: userData.cpf,
          phone: userData.phone,
          birthDate: userData.birthDate,
          address: userData.address,
          emailVerified: false,
          phoneVerified: true, // Por enquanto, sempre true
          createdAt: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        // Se falhar ao criar o perfil, remove o usuário do auth
        if (authData.user?.id) {
          await this.supabase.auth.admin.deleteUser(authData.user.id);
        }
        throw profileError;
      }

      return {
        user: profileData,
        session: authData.session,
        token: authData.session?.access_token
      };
    } catch (error) {
      // Se ocorrer qualquer erro, remove o usuário do auth
      if (authData.user?.id) {
        await this.supabase.auth.admin.deleteUser(authData.user.id);
      }
      throw error;
    }
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (authError) throw authError

    // Buscar perfil do usuário
    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError) throw userError

    return {
      user: userData as User,
      session: authData.session,
      token: authData.session.access_token
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
    return { message: 'Logged out successfully' }
  }

  async getCurrentUser(): Promise<User> {
    const { data: { session }, error: authError } = await this.supabase.auth.getSession()
    if (authError) throw authError
    if (!session) throw new Error('No active session')

    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError) throw userError
    return userData as User
  }
}