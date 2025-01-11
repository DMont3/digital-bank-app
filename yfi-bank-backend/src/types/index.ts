export interface CreateUserDTO {
  email: string;
  name: string;
  cpf: string;
  phone: string;
  birth_date: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}