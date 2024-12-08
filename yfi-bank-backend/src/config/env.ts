import dotenv from 'dotenv'

dotenv.config()

interface Config {
  port: number
  supabaseUrl: string
  supabaseKey: string
  jwtSecret: string
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  jwtSecret: process.env.JWT_SECRET || ''
}

// Validação das variáveis obrigatórias
const requiredEnvs: (keyof Config)[] = ['supabaseUrl', 'supabaseKey', 'jwtSecret']
for (const env of requiredEnvs) {
  if (!config[env]) {
    throw new Error(`Missing required environment variable: ${env}`)
  }
}