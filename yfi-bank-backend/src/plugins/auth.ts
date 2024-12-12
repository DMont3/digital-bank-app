import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { createClient, User as SupabaseUser } from '@supabase/supabase-js'
import { config } from '../config/env'

// Declaração única do tipo user no request
declare module 'fastify' {
  interface FastifyRequest {
    user?: SupabaseUser
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const supabase = createClient(config.supabaseUrl, config.supabaseKey)

  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) {
        throw new Error('No authorization header')
      }

      const token = authHeader.replace('Bearer ', '')
      if (!token) {
        throw new Error('Invalid token format')
      }

      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) {
        throw new Error('Invalid token')
      }

      request.user = user
    } catch (error: any) {
      reply.code(401).send({ error: 'Unauthorized', message: error.message })
    }
  })
}, { name: 'auth' })
