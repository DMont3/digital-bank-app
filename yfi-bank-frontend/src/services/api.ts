import axios from 'axios';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    data: config.data,
    headers: config.headers
  });
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const sendPhoneCode = async (phone: string) => {
  return api.post('/api/v1/verify/start', { phone });
};

export const verifyPhoneCode = async (phone: string, code: string) => {
  return api.post('/api/v1/verify/check', { phone, code });
};

// Serviços de pagamentos
export const createPixDeposit = async (amount: number) => {
  // Mock da API de depósito PIX
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: Math.random().toString(36).substring(7),
          amount,
          status: 'pending',
          created_at: new Date().toISOString(),
          qr_code: 'mock-qr-code',
          pix_key: 'mock-pix-key'
        }
      });
    }, 1000); // Simula 1 segundo de delay
  });
};

export const getDepositHistory = async () => {
  return api.get('/api/v1/payments/deposits');
};

// WebSocket para notificações em tempo real
export const createPaymentSocket = () => {
  const socket = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/payments`);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return socket;
};

export default api;
