// import axios from 'axios';
//
// // Criar instância do axios com configurações base
// export const supabase = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });
//
// // Interceptor para adicionar o token em todas as requisições
// supabase.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   console.log('API Request:', {
//     method: config.method?.toUpperCase(),
//     url: config.url,
//     data: config.data,
//     headers: config.headers
//   });
//   return config;
// }, (error) => {
//   console.error('Request Error:', error);
//   return Promise.reject(error);
// });
//
// // Interceptor para tratar respostas
// supabase.interceptors.response.use(
//   (response) => {
//     console.log('API Response:', {
//       status: response.status,
//       data: response.data
//     });
//     return response;
//   },
//   (error) => {
//     console.error('Response Error:', {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status
//     });
//     return Promise.reject(error);
//   }
// );
