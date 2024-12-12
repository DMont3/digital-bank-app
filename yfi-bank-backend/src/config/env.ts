import dotenv from 'dotenv'

dotenv.config()

interface Config {
  port: number
  supabaseUrl: string
  supabaseKey: string
  supabaseServiceRoleKey: string
  frontendUrl: string
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || ''
}

// Validação das variáveis obrigatórias
const requiredEnvs: (keyof Config)[] = ['supabaseUrl', 'supabaseKey', 'supabaseServiceRoleKey', 'frontendUrl']
for (const env of requiredEnvs) {
  if (!config[env]) {
    throw new Error(`Missing required environment variable: ${env}`)
  }
}