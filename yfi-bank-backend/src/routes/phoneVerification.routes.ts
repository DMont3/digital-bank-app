import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TwilioService } from '../services/twilio.service';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export async function phoneVerificationRoutes(fastify: FastifyInstance) {
  const twilioService = new TwilioService();

  fastify.post('/verify/start', async (request: FastifyRequest<{ Body: { phone: string } }>, reply: FastifyReply) => {
    try {
      const { phone } = request.body;

      // Check if a user with the given phone number already exists
      const { data: existingUser, error: supabaseError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', phone)

      if (supabaseError) {
        console.error('Error checking for existing user:', supabaseError);
        return reply.status(500).send({ error: 'Failed to check for existing user' });
      }

      if (existingUser && existingUser.length > 0) {
        return reply.status(400).send({ error: 'Phone number already registered' });
      }

      const verification = await twilioService.sendVerificationCode(phone);
      return reply.send(verification);
    } catch (error) {
      console.error('Error sending verification code:', error);
      return reply.status(500).send({ error: 'Failed to send verification code' });
    }
  });

  fastify.post('/verify/check', async (request: FastifyRequest<{ Body: { phone: string; code: string } }>, reply: FastifyReply) => {
    try {
      const { phone, code } = request.body;
      const verificationCheck = await twilioService.verifyCode(phone, code);
      return reply.send(verificationCheck);
    } catch (error) {
      console.error('Error verifying code:', error);
      return reply.status(500).send({ error: 'Failed to verify code' });
    }
  });
}
