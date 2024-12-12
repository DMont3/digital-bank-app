import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth.service'
import { CreateUserDTO, LoginDTO } from '../models/user.model'
import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env'

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService()
  
  // Cliente normal para operações públicas
  const supabase = createClient(config.supabaseUrl, config.supabaseKey)
  
  // Cliente com service_role para operações admin
  const adminSupabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Helper para extrair e validar token
  const validateToken = async (request: FastifyRequest): Promise<string> => {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      throw new Error('Invalid token format')
    }

    // Verifica se o token é válido no Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      throw new Error('Invalid token')
    }

    return token
  }

  // Enviar código de verificação por email
  fastify.post<{ Body: { email: string } }>('/verify-email', async (request, reply) => {
    try {
      const { email } = request.body
      if (!email) throw new Error('Email is required')

      console.log('Checking for existing user with email:', email)

      // Procura usuário existente com este email
      const { data: { users }, error: searchError } = await adminSupabase.auth.admin.listUsers()
      if (searchError) {
        console.error('Error listing users:', searchError)
        throw searchError
      }

      console.log('Total users found:', users.length)

      // Encontra usuário com o email específico
      const existingUser = users.find(user => user.email?.toLowerCase() === email.toLowerCase())
      
      if (existingUser) {
        console.log('Found user:', {
          id: existingUser.id,
          email: existingUser.email,
          confirmed: existingUser.email_confirmed_at,
          created: existingUser.created_at
        })

        // Se o usuário existe e já está confirmado, retorna um erro
        if (existingUser.email_confirmed_at) {
          console.log('User already confirmed, returning error')
          return reply.code(400).send({ 
            error: 'Email já cadastrado',
            message: 'Este email já está cadastrado. Por favor, faça login.'
          })
        }

        // Se o usuário existe e não está confirmado (ou está em processo de signup)
        if (!existingUser.email_confirmed_at || existingUser.user_metadata?.flow === 'signup') {
          console.log('Attempting to delete pending user:', existingUser.id)
          const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(existingUser.id)
          
          if (deleteError) {
            console.error('Error deleting user:', deleteError)
            throw deleteError
          }
          
          console.log('Successfully deleted pending user:', existingUser.id)
        } else {
          console.log('User already confirmed, not deleting')
        }
      } else {
        console.log('No existing user found with email:', email)
      }

      console.log('Sending new verification code...')

      // Envia o código usando signInWithOtp
      const { error } = await adminSupabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            flow: 'signup'
          }
        }
      })
      
      if (error) {
        console.error('Error sending OTP:', error)
        throw error
      }

      console.log('Verification code sent successfully')

      return reply.code(200).send({ message: 'Verification code sent. Check your email.' })
    } catch (error: any) {
      console.error('Failed to send verification code:', error)
      return reply.code(400).send({ 
        error: 'Failed to send verification code',
        message: error.message 
      })
    }
  })

  // Verificar código e registrar usuário
  fastify.post<{ Body: CreateUserDTO & { token: string } }>('/verify-code', async (request, reply) => {
    try {
      const { email, token, ...userData } = request.body
      console.log('Received registration data:', request.body)

      // Validação dos campos obrigatórios
      const requiredFields = ['email', 'token', 'name', 'cpf', 'phone', 'birthDate'] as const
      const missingFields = requiredFields.filter(field => !request.body[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}. Por favor, preencha todos os campos e tente novamente.`)
      }

      if (!email || !token) {
        throw new Error('Email e código de verificação são obrigatórios')
      }

      // Verifica o código OTP
      console.log('Verifying OTP...')
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      })
      
      if (verifyError) {
        console.error('OTP verification failed:', verifyError)
        // Mensagens personalizadas baseadas no tipo de erro
        if (verifyError.message.includes('expired')) {
          throw new Error('O código de verificação expirou. Por favor, solicite um novo código na tela anterior.')
        } else if (verifyError.message.includes('invalid')) {
          throw new Error('Código de verificação inválido. Verifique se digitou corretamente ou solicite um novo código.')
        }
        throw new Error('Erro ao verificar o código. Por favor, tente novamente ou solicite um novo código.')
      }
      
      if (!verifyData.user?.id) {
        console.error('No user returned after verifyOtp')
        throw new Error('Erro no processo de verificação. Por favor, tente novamente do início.')
      }

      console.log('OTP verified successfully, updating user data...')
      
      // Agora atualizamos a senha e metadados do usuário usando o cliente admin
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
        verifyData.user.id,
        {
          password: userData.password,
          user_metadata: {
            name: userData.name,
            phone: userData.phone
          }
        }
      )
      
      if (updateError) {
        console.error('Failed to update user:', updateError)
        throw new Error('Erro ao atualizar seus dados. Por favor, tente novamente. Se o erro persistir, solicite um novo código de verificação.')
      }

      console.log('User updated successfully, creating profile...')

      // Log dos dados que serão enviados para debug
      console.log('Profile data being sent:', {
        address: userData.address || {},
        birth_date: userData.birthDate || null,
        cpf: userData.cpf || '',
        email,
        name: userData.name || '',
        phone: userData.phone || '',
        user_id: verifyData.user.id
      })

      // Criar o perfil do usuário usando a função do banco com os parâmetros na ordem correta
      const { data: profile, error: profileError } = await adminSupabase.rpc('register_user_profile', {
        p_address: userData.address || {},
        p_birth_date: userData.birthDate || null,
        p_cpf: userData.cpf || '',
        p_email: email,
        p_name: userData.name || '',
        p_phone: userData.phone || '',
        p_user_id: verifyData.user.id
      })

      if (profileError) {
        console.error('Failed to create user profile:', profileError)
        // Se falhar ao criar o perfil, deleta o usuário do Auth
        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(verifyData.user.id)
        if (deleteError) {
          console.error('Failed to cleanup user after profile creation failed:', deleteError)
        }
        throw new Error('Erro ao criar seu perfil. Por favor, tente o processo de registro novamente. Se o erro persistir, verifique se todos os dados estão preenchidos corretamente.')
      }

      console.log('Profile created successfully:', profile)

      return reply.code(201).send({
        user: profile,
        session: verifyData.session,
        token: verifyData.session?.access_token,
        message: 'Registration successful.'
      })
    } catch (error: any) {
      console.error('Registration failed:', error)
      return reply.code(400).send({ 
        error: 'Registration failed',
        message: error.message,
        details: error.details || error.hint || undefined
      })
    }
  })

  // Login
  fastify.post<{ Body: LoginDTO }>('/login', async (request, reply) => {
    try {
      const response = await authService.login(request.body)
      return reply.code(200).send(response)
    } catch (error: any) {
      return reply.code(401).send({ 
        error: 'Authentication failed',
        message: error.message 
      })
    }
  })

  // Logout
  fastify.post('/logout', async (request, reply) => {
    try {
      const token = await validateToken(request)
      await authService.logout(token)
      return reply.code(200).send({ message: 'Logged out successfully' })
    } catch (error: any) {
      return reply.code(401).send({ 
        error: 'Logout failed',
        message: error.message 
      })
    }
  })

  // Obter usuário atual
  fastify.get('/me', async (request, reply) => {
    try {
      const token = await validateToken(request)
      const user = await authService.getCurrentUser(token)
      return reply.code(200).send(user)
    } catch (error: any) {
      return reply.code(401).send({ 
        error: 'Failed to get user profile',
        message: error.message 
      })
    }
  })

  // Reset password
  fastify.post<{ Body: { email: string } }>('/reset-password', async (request, reply) => {
    try {
      const { email } = request.body
      if (!email) {
        return reply.code(400).send({ error: 'Email is required' })
      }

      await authService.resetPassword(email)
      return reply.code(200).send({ message: 'Password reset email sent' })
    } catch (error: any) {
      return reply.code(400).send({ 
        error: 'Failed to send reset password email',
        message: error.message 
      })
    }
  })
}