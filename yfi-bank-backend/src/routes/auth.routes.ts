import { FastifyInstance } from 'fastify';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const twilioClient = twilio(config.twilioAccountSid, config.twilioAuthToken);
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);


// Helper function to format phone number to E.164
function formatPhoneNumberToE164(phone: string): string {
  const numericPhone = phone.replace(/\D/g, '');

  if (phone.startsWith('+')) {
    return numericPhone;
  } else {
    return `+55${numericPhone}`;
  }
}

export async function authRoutes(fastify: FastifyInstance) {
  // Send verification code via SMS
  fastify.post<{ Body: { phone: string } }>(
    '/send-verification-code',
    async (request, reply) => {
      try {
        const { phone } = request.body;

        if (!phone) {
          throw new Error('Phone number is required.');
        }

        const formattedPhone = formatPhoneNumberToE164(phone);

        const verification = await twilioClient.verify.v2
          .services(config.twilioServiceSid)
          .verifications.create({ to: formattedPhone, channel: 'sms' });

        if (verification.status !== 'pending') {
          throw new Error('Failed to send verification code.');
        }

        return reply.code(200).send({
          message: 'Verification code sent.',
        });
      } catch (error: any) {
        console.error('Failed to send verification code:', error);
        return reply.code(400).send({
          error: 'Failed to send verification code',
          message: error.message,
        });
      }
    }
  );

  // Verify the code sent via SMS
  fastify.post<{ Body: { code: string; phone: string } }>(
    '/verify-code',
    async (request, reply) => {
      try {
        const { code, phone } = request.body;

        if (!code || !phone) {
          throw new Error('Code and phone are required.');
        }

        const formattedPhone = formatPhoneNumberToE164(phone);

        const verificationCheck = await twilioClient.verify.v2
          .services(config.twilioServiceSid)
          .verificationChecks.create({ to: formattedPhone, code });

        if (verificationCheck.status !== 'approved') {
          throw new Error('Invalid verification code.');
        }

        return reply.code(200).send({
          message: 'Verification successful.',
        });
      } catch (error: any) {
        console.error('Verification failed:', error);
        return reply.code(400).send({
          error: 'Verification failed',
          message: error.message,
        });
      }
    }
  );

  // Endpoint to insert user data into the users table
  fastify.post<{
    Body: {
      id: string;
      email: string;
      name: string;
      cpf: string;
      phone: string;
      birthDate: string;
      address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
    };
  }>('/insert-user', async (request, reply) => {
    const { id, email, name, cpf, phone, birthDate, address } = request.body;

    console.log('Received request to insert user:', { id, email, name, cpf, phone, birthDate, address });

    try {
      // Call the Supabase function to insert user data
      const { data, error } = await supabase.rpc('insert_user_profile', {
        user_id: id,
        user_email: email,
        user_name: name,
        user_cpf: cpf,
        user_phone: phone,
        user_birth_date: birthDate,
        user_address: address,
      });

      if (error) {
        console.error('Error inserting user data:', error);
        throw error;
      }

      console.log('User data inserted successfully:', data);

      return reply.code(200).send({
        message: 'User data inserted successfully.',
        data,
      });
    } catch (error: any) {
      console.error('Error inserting user data:', error);
      return reply.code(500).send({
        error: 'Failed to insert user data',
        message: error.message,
      });
    }
  });
}