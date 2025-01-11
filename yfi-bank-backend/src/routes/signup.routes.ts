import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { CreateUserDTO } from '../types';

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export async function signupRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', async (request: FastifyRequest<{ Body: CreateUserDTO & { password: string } }>, reply: FastifyReply) => {
    const { email, password, ...userData } = request.body;

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Erro ao registrar usuário no Supabase Auth:', authError);
        return reply.status(500).send({ error: 'Erro ao registrar usuário' });
      }

      if (authData.user) {
        console.log('Calling insert_user_profile with data:', {
          user_id: authData.user.id,
          user_email: email,
          user_name: userData.name,
          user_cpf: userData.cpf,
          user_phone: userData.phone,
          user_birth_date: userData.birth_date,
          user_address: userData.address,
          phone_verified: true,
        });
        const { error: userError } = await supabase.rpc('insert_user_profile', {
          user_id: authData.user.id,
          user_email: email,
          user_name: userData.name,
          user_cpf: userData.cpf,
          user_phone: userData.phone,
          user_birth_date: userData.birth_date,
          user_address: userData.address,
          phone_verified: true,
        });
        console.log('insert_user_profile call completed with error:', userError);

        if (userError) {
          console.error('Erro ao adicionar dados do usuário:', userError);
          return reply.status(500).send({ error: 'Erro ao adicionar dados do usuário' });
        }

        return reply.status(201).send({ message: 'Usuário criado com sucesso' });
      }
    } catch (error) {
      console.error('Erro durante o processo de signup:', error);
      return reply.status(500).send({ error: 'Erro durante o processo de signup' });
    }
  });
}