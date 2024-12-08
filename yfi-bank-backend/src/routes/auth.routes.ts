import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth.service'
import { CreateUserDTO, LoginDTO } from '../models/user.model'

const authService = new AuthService()

export async function authRoutes(fastify: FastifyInstance) {
  // Enviar código de verificação por email
  fastify.post<{ Body: { email: string } }>(
    '/verify-email',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
      try {
        const result = await authService.sendEmailVerification(request.body.email)
        reply.send(result)
      } catch (error: any) {
        reply.code(400).send({ error: error.message })
      }
    }
  )

  // Verificar código de email
  fastify.post<{ Body: { email: string; code: string } }>(
    '/verify-email-code',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'code'],
          properties: {
            email: { type: 'string', format: 'email' },
            code: { type: 'string' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: { email: string; code: string } }>, reply: FastifyReply) => {
      try {
        const result = await authService.verifyEmailCode(
          request.body.email,
          request.body.code
        )
        reply.send(result)
      } catch (error: any) {
        reply.code(400).send({ error: error.message })
      }
    }
  )

  // Registro completo
  fastify.post<{ Body: CreateUserDTO }>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password', 'name', 'cpf', 'phone', 'birthDate', 'address'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string' },
            cpf: { type: 'string' },
            phone: { type: 'string' },
            birthDate: { type: 'string' },
            address: {
              type: 'object',
              required: ['cep', 'street', 'number', 'neighborhood', 'city', 'state'],
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
    async (request: FastifyRequest<{ Body: CreateUserDTO }>, reply: FastifyReply) => {
      try {
        const user = await authService.register(request.body)
        reply.code(201).send(user)
      } catch (error: any) {
        if (error.errors) {
          reply.code(400).send({ errors: error.errors })
        } else {
          reply.code(400).send({ error: error.message })
        }
      }
    }
  )

  // Login
  fastify.post<{ Body: LoginDTO }>(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) => {
      try {
        const session = await authService.login(request.body)
        reply.send(session)
      } catch (error: any) {
        reply.code(401).send({ error: error.message })
      }
    }
  )

  // Logout
  fastify.post(
    '/logout',
    {
      onRequest: [fastify.authenticate]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await authService.logout()
        reply.send(result)
      } catch (error: any) {
        reply.code(500).send({ error: error.message })
      }
    }
  )

  // Obter usuário atual
  fastify.get(
    '/me',
    {
      onRequest: [fastify.authenticate]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await authService.getCurrentUser()
        reply.send(user)
      } catch (error: any) {
        reply.code(401).send({ error: error.message })
      }
    }
  )

  // Atualizar verificação de usuário
  fastify.post<{ Body: { userId: string; type: 'email' | 'phone'; verified: boolean } }>(
    '/update-verification',
    {
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'type', 'verified'],
          properties: {
            userId: { type: 'string' },
            type: { type: 'string', enum: ['email', 'phone'] },
            verified: { type: 'boolean' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: { userId: string; type: 'email' | 'phone'; verified: boolean } }>, reply: FastifyReply) => {
      try {
        const user = await authService.updateUserVerification(
          request.body.userId,
          request.body.type,
          request.body.verified
        );
        reply.send(user);
      } catch (error: any) {
        reply.code(400).send({ error: error.message });
      }
    }
  );
}