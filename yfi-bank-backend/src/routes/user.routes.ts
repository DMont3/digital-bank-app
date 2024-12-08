import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from '../services/user.service'
import { User } from '../models/user.model'

const userService = new UserService()

export async function userRoutes(fastify: FastifyInstance) {
  // Todas as rotas aqui requerem autenticação
  fastify.addHook('preHandler', fastify.authenticate)

  // Obter perfil do usuário
  fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const profile = await userService.getProfile(request.user.id)
      reply.send(profile)
    } catch (error: any) {
      reply.code(400).send({ error: error.message })
    }
  })

  // Atualizar perfil
  fastify.put<{ Body: Partial<User> }>(
    '/profile',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                cep: { type: 'string' },
                street: { type: 'string' },
                number: { type: 'string' },
                complement: { type: 'string' },
                neighborhood: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: Partial<User> }>, reply: FastifyReply) => {
      try {
        const updatedProfile = await userService.updateProfile(
          request.user.id,
          request.body
        )
        reply.send(updatedProfile)
      } catch (error: any) {
        reply.code(400).send({ error: error.message })
      }
    }
  )

  // Deletar conta
  fastify.delete('/account', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await userService.deleteAccount(request.user.id)
      reply.send({ message: 'Account deleted successfully' })
    } catch (error: any) {
      reply.code(400).send({ error: error.message })
    }
  })
}