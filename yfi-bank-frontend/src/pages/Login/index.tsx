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
import { api } from '../../services/api'; 

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const errors: ValidationError[] = [];

        if (!formValues.email) {
            errors.push({
                field: 'email',
                message: 'Por favor, informe seu email.'
            });
        } else if (!validateEmail(formValues.email)) {
            errors.push({
                field: 'email',
                message: 'Por favor, informe um email válido.'
            });
        }

        if (!formValues.password) {
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
            const response = await api.post('/auth/login', formValues);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
            
            
            // Simulação de delay para feedback visual
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // TODO: Remover após implementar API
            navigate('/dashboard');
        } catch (error) {
            setError('Email ou senha incorretos. Por favor, verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // TODO: Implementar rota para recuperação de senha
        navigate('/recuperar-senha');
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