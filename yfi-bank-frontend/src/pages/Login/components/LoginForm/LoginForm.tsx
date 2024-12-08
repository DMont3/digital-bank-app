import React from 'react';
import { TextField, Box, Alert, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginFormData, ValidationError } from '../../../../types/common';
import CustomButton from '../../../../components/common/CustomButton/CustomButton';

interface LoginFormProps {
    formValues: LoginFormData;
    errors: ValidationError[];
    error?: string;
    isLoading?: boolean;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    formValues,
    errors,
    error,
    isLoading = false,
    onSubmit,
    onChange,
    onForgotPassword
}) => {
    const navigate = useNavigate();
    const emailError = errors.find(error => error.field === 'email')?.message;
    const passwordError = errors.find(error => error.field === 'password')?.message;

    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
                <Alert 
                    severity="error"
                    sx={{
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        color: '#ff5252',
                        '& .MuiAlert-icon': {
                            color: '#ff5252'
                        }
                    }}
                >
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={onChange}
                error={!!emailError}
                helperText={emailError}
                placeholder="seu.email@exemplo.com"
                required
                disabled={isLoading}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(241, 196, 15, 0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(241, 196, 15, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#f1c40f',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                            color: '#f1c40f',
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-error': {
                            color: '#ff5252',
                        },
                    },
                }}
            />

            <Box sx={{ width: '100%' }}>
                <TextField
                    fullWidth
                    label="Senha"
                    name="password"
                    type="password"
                    value={formValues.password}
                    onChange={onChange}
                    error={!!passwordError}
                    helperText={passwordError}
                    required
                    disabled={isLoading}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(241, 196, 15, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(241, 196, 15, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#f1c40f',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                                color: '#f1c40f',
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            color: 'white',
                        },
                        '& .MuiFormHelperText-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-error': {
                                color: '#ff5252',
                            },
                        },
                    }}
                />
                <Typography
                    onClick={onForgotPassword}
                    sx={{
                        color: '#f1c40f',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        mt: 1,
                        textAlign: 'right',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Esqueci minha senha
                </Typography>
            </Box>

            <CustomButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2 }}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </CustomButton>

            <Box sx={{ textAlign: 'center', mt: 0.725 }}>
                <Typography 
                    sx={{ 
                        color: '#f1c40f',
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                    onClick={() => navigate('/signup')}
                >
                    Não tem uma conta? Cadastre-se
                </Typography>
            </Box>
        </form>
    );
};

export default LoginForm;