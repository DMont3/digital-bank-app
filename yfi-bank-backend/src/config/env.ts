import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioServiceSid: string;
  frontendUrl: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || '',
  frontendUrl: process.env.FRONTEND_URL || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

// Validação das variáveis obrigatórias
const requiredEnvs: (keyof Config)[] = [
  'twilioAccountSid',
  'twilioAuthToken',
  'twilioServiceSid',
  'frontendUrl',
  'supabaseUrl',
  'supabaseServiceRoleKey',
];

for (const env of requiredEnvs) {
  if (!config[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}