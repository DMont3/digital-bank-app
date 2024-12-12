import React, { useState } from 'react';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginFormData, ValidationError } from '../../types/common';
import LoginForm from './components/LoginForm/LoginForm';
import { createClient } from '@supabase/supabase-js';
import { sanitizeString } from '../../utils/sanitizers';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: sanitizeString(value)
        }));
    };

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        const errors: ValidationError[] = [];

        const sanitizedEmail = sanitizeString(formValues.email);
        const sanitizedPassword = formValues.password; // Não sanitizamos senha

        if (!sanitizedEmail) {
            errors.push({
                field: 'email',
                message: 'Por favor, informe seu email.'
            });
        } else if (!validateEmail(sanitizedEmail)) {
            errors.push({
                field: 'email',
                message: 'Por favor, informe um email válido.'
            });
        }

        if (!sanitizedPassword) {
            errors.push({
                field: 'password',
                message: 'Por favor, informe sua senha.'
            });
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);
        setError('');
        setValidationErrors([]);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: sanitizedEmail,
                password: sanitizedPassword
            });

            if (authError) throw authError;

            if (data.session) {
                navigate('/dashboard', { replace: true });
                return;
            }

            setError('Erro ao processar login. Por favor, tente novamente.');
        } catch (error: any) {
            console.error('Erro no login:', error);
            const errorMessage = error.message || 'Erro ao fazer login. Por favor, tente novamente.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
                display: 'flex',
                alignItems: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={800}>
                    <Card
                        elevation={24}
                        sx={{
                            borderRadius: 4,
                            background: 'rgba(30, 30, 30, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(241, 196, 15, 0.1)',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 700,
                                        mb: 1
                                    }}
                                >
                                    Login
                                </Typography>
                            </Box>

                            <LoginForm
                                formValues={formValues}
                                errors={validationErrors}
                                error={error}
                                isLoading={isLoading}
                                onSubmit={handleSubmit}
                                onChange={handleChange}
                                onForgotPassword={handleForgotPassword}
                            />
                        </CardContent>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default LoginPage;