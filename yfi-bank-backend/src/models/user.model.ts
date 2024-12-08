import { Session } from '@supabase/supabase-js';

export interface Address {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface User {
  id: string
  email: string
  name: string
  cpf: string
  phone: string
  birthDate: string
  address: Address
  emailVerified?: boolean
  phoneVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserDTO {
  email: string
  password: string
  name: string
  cpf: string
  phone: string
  birthDate: string
  address: Address
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  session: Session | null
  token?: string
}