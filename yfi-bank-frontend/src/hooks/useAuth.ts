import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SignupFormData } from '../types/common';

type User = Omit<SignupFormData, 'emailCode' | 'phoneCode' | 'confirmPassword'> & { id: string };

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.get<User>('/auth/me');
                    setUser(response.data);
                }
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    return { user, loading };
}