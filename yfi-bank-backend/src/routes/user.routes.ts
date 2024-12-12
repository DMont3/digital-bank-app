import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from '../services/user.service'
import { UserProfile } from '../models/user.model'
import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env'

const userService = new UserService()

export async function userRoutes(fastify: FastifyInstance) {
  const supabase = createClient(config.supabaseUrl, config.supabaseKey)

  // Middleware de autenticação
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
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

      // Adiciona o usuário ao request para uso nas rotas
      request.user = user
    } catch (error: any) {
      reply.code(401).send({ error: 'Unauthorized', message: error.message })
    }
  }

  // Todas as rotas aqui requerem autenticação
  fastify.addHook('preHandler', authenticate)

  // Obter perfil do usuário
  fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: 'User not authenticated' })
      }
      const profile = await userService.getProfile(request.user.id)
      reply.send(profile)
    } catch (error: any) {
      reply.code(400).send({ error: error.message })
    }
  })

  // Atualizar perfil
  fastify.put<{ Body: Partial<UserProfile> }>('/profile', async (request: FastifyRequest<{ Body: Partial<UserProfile> }>, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: 'User not authenticated' })
      }
      const updatedProfile = await userService.updateProfile(request.user.id, request.body)
      reply.send(updatedProfile)
    } catch (error: any) {
      reply.code(400).send({ error: error.message })
    }
  })

  // Excluir conta
  fastify.delete('/account', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.code(401).send({ error: 'User not authenticated' })
      }
      await userService.deleteAccount(request.user.id)
      reply.send({ message: 'Account deleted successfully' })
    } catch (error: any) {
      reply.code(400).send({ error: error.message })
    }
  })
}