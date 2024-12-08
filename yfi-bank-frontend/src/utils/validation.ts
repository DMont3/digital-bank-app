// validation.ts
import { ValidationError } from '../types/common';

// Validation functions
export const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  export const validatePhone = (phone: string): boolean => {
    // Remove non-digits
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11;
  };
  
  export const validateCPF = (cpf: string): boolean => {
    // Remove non-digits
    cpf = cpf.replace(/\D/g, '');

    // Check length
    if (cpf.length !== 11) return false;

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validate digits
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };
  
  export const validateName = (name: string): boolean => {
    // Check if name has at least two words (first and last name)
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) return false;

    // Check if all parts contain only letters
    return nameParts.every(part => /^[a-zA-ZÀ-ÿ]+$/.test(part));
  };
  
  export const validatePassword = (password: string): { isValid: boolean; errors: ValidationError[] } => {
    const errors: ValidationError[] = [];
    
    if (password.length < 8) {
      errors.push({
        field: 'password',
        message: 'A senha deve ter pelo menos 8 caracteres'
      });
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'A senha deve conter pelo menos uma letra maiúscula'
      });
    }
    if (!/[a-z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'A senha deve conter pelo menos uma letra minúscula'
      });
    }
    if (!/[0-9]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'A senha deve conter pelo menos um número'
      });
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)'
      });
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  export const validateCEP = (cep: string): boolean => {
    // Remove non-digits
    const numbers = cep.replace(/\D/g, '');
    return numbers.length === 8;
  };