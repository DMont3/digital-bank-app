import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { phoneVerificationRoutes } from './routes/phoneVerification.routes';

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  // Registrar plugins
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })

  // Registrar rotas
  await fastify.register(phoneVerificationRoutes, { prefix: '/api/v1' });

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
