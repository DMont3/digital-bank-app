import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/auth.routes'
import { swaggerPlugin } from './plugins/swagger'

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  // Registrar plugins
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
  
  await fastify.register(swaggerPlugin)

  // Registrar rotas
  await fastify.register(authRoutes, { prefix: '/auth' })

  // Iniciar servidor
  try {
    await fastify.listen({ 
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

bootstrap()