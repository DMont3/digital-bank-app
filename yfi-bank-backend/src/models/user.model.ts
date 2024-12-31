export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  address?: Address;
  email_verified?: boolean;
  phone_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
  birthDate: string;
  address: Address;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile | null;
}