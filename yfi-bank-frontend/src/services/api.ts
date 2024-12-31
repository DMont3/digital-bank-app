import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '../types/common'; // Importe a interface

// Create an axios instance with base configurations
export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor to add the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        if (response.data.error) {
            console.error('API Error:', response.data.error);
            return Promise.reject(new Error(response.data.error));
        }
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);