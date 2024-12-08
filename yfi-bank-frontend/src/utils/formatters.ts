// formatters.ts

export const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };
  
  export const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '').substring(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };
  
  export const formatCEP = (value: string): string => {
    // Remove qualquer caractere que não seja número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const cep = numbers.substring(0, 8);
    
    // Se não tiver números, retorna vazio
    if (cep.length === 0) return '';
    
    // Se tiver 5 ou menos dígitos, não formata
    if (cep.length <= 5) return cep;
    
    // Formata com o hífen
    return `${cep.slice(0, 5)}-${cep.slice(5)}`;
  };