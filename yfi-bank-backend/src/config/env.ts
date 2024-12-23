import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioVerifyServiceSid: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioVerifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
};

// Validação das variáveis obrigatórias
const requiredEnvs: (keyof Config)[] = ['twilioAccountSid', 'twilioAuthToken', 'twilioVerifyServiceSid', 'supabaseUrl', 'supabaseAnonKey'];
for (const env of requiredEnvs) {
  if (!config[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}
