import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

export async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true, // Em produção, você deve especificar os domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
}