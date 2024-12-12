// src/pages/Signup/index.tsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Card,
    CardContent,
    Button,
    Link,
    Typography,
    Fade,
    CircularProgress,
    Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { api } from '../../services/api';
import CustomButton from '../../components/common/CustomButton/CustomButton';
import { SignupFormData, ValidationError, AddressData, StepValidation } from '../../types/common';
import { validateEmail, validatePhone, validateCPF, validateName, validatePassword, validateCEP } from '../../utils/validation';
import { formatPhone, formatCPF, formatCEP } from '../../utils/formatters'; // Importa os formatters
import { useSignupStore } from '../../stores/signupStore';

// Import components
import StepProgress from './components/StepProgress/StepProgress';
import PhoneStep from './components/PhoneStep/PhoneStep';
import PhoneVerificationStep from './components/PhoneVerificationStep/PhoneVerificationStep';
import PasswordStep from './components/PasswordStep/PasswordStep';
import PersonalInfoStep from './components/PersonalInfoStep/PersonalInfoStep';
import CepStep from './components/CepStep/CepStep';
import AddressStep from './components/AddressStep/AddressStep';
import EmailStep from './components/EmailStep/EmailStep';
import EmailVerificationStep from './components/EmailVerificationStep/EmailVerificationStep';
import SuccessStep from './components/SuccessStep/SuccessStep';

const steps = [
    'Telefone',
    'Verificação de Telefone',
    'Senha',
    'Dados Pessoais',
    'CEP',
    'Endereço',
    'Email',
    'Verificação de Email',
    'Sucesso'
] as const;

type StepType = typeof steps[number];

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { formData, setFormData, activeStep, setActiveStep, resetStore } = useSignupStore();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [phoneTimer, setPhoneTimer] = useState<number>(0);
    const [emailTimer, setEmailTimer] = useState<number>(0);
    const [expirationTimer, setExpirationTimer] = useState<number>(600); // 10 minutos em segundos
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(0); // Timer para reenvio de código de email

    useEffect(() => {
        let phoneInterval: NodeJS.Timeout;
        let emailInterval: NodeJS.Timeout;
        let expirationInterval: NodeJS.Timeout;
        let resendInterval: NodeJS.Timeout;

        if (phoneTimer > 0) {
            phoneInterval = setInterval(() => {
                setPhoneTimer(prev => Math.max(0, prev - 1));
            }, 1000);
        }

        if (emailTimer > 0) {
            emailInterval = setInterval(() => {
                setEmailTimer(prev => Math.max(0, prev - 1));
            }, 1000);
        }

        if (resendTimer > 0) {
            resendInterval = setInterval(() => {
                setResendTimer(prev => Math.max(0, prev - 1));
            }, 1000);
        }

        if (expirationTimer > 0 && (activeStep === 7 || activeStep === 1)) {
            expirationInterval = setInterval(() => {
                setExpirationTimer(prev => {
                    const newValue = Math.max(0, prev - 1);
                    if (newValue === 0) {
                        // Código expirou
                        setValidationErrors(prev => [...prev, { 
                            field: activeStep === 7 ? 'emailCode' : 'phoneCode',
                            message: 'Código expirado. Por favor, solicite um novo código.'
                        }]);
                    }
                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (phoneInterval) clearInterval(phoneInterval);
            if (emailInterval) clearInterval(emailInterval);
            if (resendInterval) clearInterval(resendInterval);
            if (expirationInterval) clearInterval(expirationInterval);
        };
    }, [phoneTimer, emailTimer, expirationTimer, activeStep, resendTimer]);

    useEffect(() => {
        return () => {
            resetStore();
        };
    }, [resetStore]);

    const startTimer = (type: 'email' | 'phone') => {
        if (type === 'email') {
            setEmailTimer(60);
        } else {
            setPhoneTimer(60);
        }
    };

    const startResendTimer = () => {
        setResendTimer(60); // 60 segundos
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
        setValidationErrors([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        let formattedValue = value;

        switch (name) {
            case 'phone':
                formattedValue = formatPhone(value);
                break;
            case 'cpf':
                formattedValue = formatCPF(value);
                break;
            case 'cep':
                formattedValue = formatCEP(value);
                break;
            case 'birthDate':
                // **Atenção:** Verifique o formato esperado pelo backend para a data.
                // Se o backend espera 'yyyy-mm-dd', evite formatar para 'dd/mm/yyyy'.
                // Neste caso, não aplicamos formatDate.
                // formattedValue = formatDate(value);
                break;
            default:
                break;
        }

        setFormData({ ...formData, [name]: formattedValue });
        clearMessages();
    };

    const sendEmailCode = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            const response = await api.post('/auth/verify-email', { email: formData.email });

            if (response.status === 200) {
                setSuccess('Código de verificação enviado para seu email.');
                startTimer('email');
                startResendTimer();
                setActiveStep(prev => prev + 1); // Avança para a próxima etapa
            }
        } catch (error: any) {
            let errorMessage = error.response?.data?.error || 'Erro ao enviar código de verificação.';
            
            // Trata o erro de rate limit
            if (error.response?.data?.code === 'over_email_send_rate_limit') {
                errorMessage = 'Aguarde alguns minutos antes de tentar enviar outro código.';
            }
            
            setError(errorMessage);
            throw error; 
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendPhoneCode = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            // Aqui você pode implementar a lógica para enviar o código por telefone
            // Por enquanto, vamos simular o envio e avançar para a próxima etapa
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula um delay de 1 segundo

            setSuccess('Código enviado para seu telefone.');
            startTimer('phone');
            setActiveStep(prev => prev + 1); // Avança para a próxima etapa
        } catch (error: any) {
            setError('Erro ao enviar código. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyPhoneCode = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            if (!formData.phoneCode || formData.phoneCode.replace(/\D/g, '').length !== 6) {
                throw new Error('Código de verificação inválido.');
            }

            // Aqui você deveria chamar a API para verificar o código
            // Por enquanto, vamos simular a verificação e avançar para a próxima etapa
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula um delay de 1 segundo

            setSuccess('Telefone verificado com sucesso.');
            setActiveStep(prev => prev + 1); // Avança para a próxima etapa
        } catch (error: any) {
            setError(error.message || 'Código de verificação inválido.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyEmailCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        setValidationErrors([]);

        try {
            console.log(`Verificando código de email para: ${formData.email}`);

            const response = await api.post('/auth/verify-code', {
                email: formData.email,
                token: formData.emailCode, // Código de verificação
                name: formData.name,
                cpf: formData.cpf,
                phone: formData.phone,
                birthDate: formData.birthDate,
                address: {
                    cep: formData.cep,
                    street: formData.street,
                    number: formData.number,
                    complement: '', // **Correção 1:** Sempre define como vazio
                    neighborhood: formData.neighborhood,
                    city: formData.city,
                    state: formData.state
                },
                password: formData.password
            });

            if (response.status === 201) {
                const { token } = response.data; // Certifique-se de que o backend retorna o token
                // Armazene o token conforme sua lógica (exemplo com localStorage)
                localStorage.setItem('authToken', token);
                setSuccess('Cadastro realizado com sucesso!');
                setActiveStep(8); // **Correção 2:** Direciona para a etapa de sucesso
                // resetStore(); // ❌ Remover esta linha para evitar reinicialização do activeStep
            } else {
                setError('Erro inesperado durante o cadastro.');
            }
        } catch (error: any) {
            console.error('Erro ao verificar código de email:', error);
            setError(error.response?.data?.message || 'Erro ao verificar código de email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateStep = (step: number): boolean => {
        let newErrors: ValidationError[] = [];

        switch (step) {
            case 0: // Telefone
                if (!formData.phone || !validatePhone(formData.phone)) {
                    newErrors.push({ field: 'phone', message: 'Telefone inválido.' });
                }
                break;
            case 1: // Verificação de Telefone
                if (!formData.phoneCode || formData.phoneCode.replace(/\D/g, '').length !== 6) {
                    newErrors.push({ field: 'phoneCode', message: 'Código de verificação inválido.' });
                }
                break;
            case 2: // Senha
                const passwordValidation = validatePassword(formData.password);
                if (!passwordValidation.isValid) {
                    newErrors.push(...passwordValidation.errors);
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.push({ field: 'confirmPassword', message: 'As senhas não coincidem.' });
                }
                break;
            case 3: // Dados Pessoais
                if (!formData.name || !validateName(formData.name)) {
                    newErrors.push({ field: 'name', message: 'Nome inválido.' });
                }
                if (!formData.cpf || !validateCPF(formData.cpf)) {
                    newErrors.push({ field: 'cpf', message: 'CPF inválido.' });
                }
                if (!formData.birthDate) {
                    newErrors.push({ field: 'birthDate', message: 'Data de nascimento inválida.' });
                }
                break;
            case 4: // CEP
                if (!formData.cep || !validateCEP(formData.cep)) {
                    newErrors.push({ field: 'cep', message: 'CEP inválido.' });
                }
                break;
            case 5: // Endereço
                if (!formData.street) {
                    newErrors.push({ field: 'street', message: 'Rua inválida.' });
                }
                if (!formData.number) {
                    newErrors.push({ field: 'number', message: 'Número inválido.' });
                }
                if (!formData.neighborhood) {
                    newErrors.push({ field: 'neighborhood', message: 'Bairro inválido.' });
                }
                if (!formData.city) {
                    newErrors.push({ field: 'city', message: 'Cidade inválida.' });
                }
                if (!formData.state) {
                    newErrors.push({ field: 'state', message: 'Estado inválido.' });
                }
                break;
            case 6: // Email
                if (!formData.email || !validateEmail(formData.email)) {
                    newErrors.push({ field: 'email', message: 'Email inválido.' });
                }
                break;
            case 7: // Verificação de Email
                if (!formData.emailCode || formData.emailCode.replace(/\D/g, '').length !== 6) {
                    newErrors.push({ field: 'emailCode', message: 'Código de verificação inválido.' });
                }
                break;
            default:
                break;
        }

        setValidationErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleNext = async () => {
        // Valida a etapa atual
        if (!validateStep(activeStep)) {
            return;
        }

        // Ações específicas para cada etapa
        switch (activeStep) {
            case 0: // Telefone
                await sendPhoneCode();
                break;
            case 1: // Verificação de Telefone
                await verifyPhoneCode();
                break;
            case 6: // Email
                await sendEmailCode();
                break;
            case 7: // Verificação de Email
                // Não faz nada aqui, pois a verificação é tratada pelo botão "Próximo"
                break;
            default:
                setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
        setValidationErrors([]);
    };

    const handleCepBlur = async (cep: string) => {
        if (!cep || cep.length !== 8) return;

        try {
            setIsLoading(true);
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            
            if (response.data.erro) {
                setValidationErrors(prev => [...prev, { field: 'cep', message: 'CEP não encontrado.' }]);
                return;
            }

            const addressData = {
                street: response.data.logradouro,
                neighborhood: response.data.bairro,
                city: response.data.localidade,
                state: response.data.uf,
                complement: '' // **Correção 1:** Define sempre como vazio
            };

            setFormData({ ...formData, ...addressData });
            setActiveStep(prev => prev + 1);
        } catch (error) {
            setValidationErrors(prev => [...prev, { field: 'cep', message: 'Erro ao buscar CEP.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async (type: 'email' | 'phone') => {
        try {
            setError('');
            setSuccess('');
            setIsSubmitting(true);
            if (type === 'email') {
                await handleResendEmailCode();
            } else {
                await sendPhoneCode();
            }
            setSuccess('Código reenviado com sucesso.');
        } catch (error: any) {
            setValidationErrors([{ 
                field: type === 'email' ? 'email' : 'phone', 
                message: error.response?.data?.message || 'Erro ao reenviar código.' 
            }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendEmailCode = async () => {
        if (resendTimer > 0) return; // Impede reenvio se o timer ainda não expirou

        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            const response = await api.post('/auth/verify-email', { email: formData.email });

            if (response.status === 200) {
                setSuccess('Código de verificação reenviado para seu email.');
                startResendTimer(); // Inicia o timer
            }
        } catch (error: any) {
            let errorMessage = error.response?.data?.error || 'Erro ao reenviar código de verificação.';
            
            // Trata o erro de rate limit
            if (error.response?.data?.code === 'over_email_send_rate_limit') {
                errorMessage = 'Aguarde alguns minutos antes de tentar reenviar outro código.';
            }
            
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0: // Telefone
                return (
                    <PhoneStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 1: // Verificação de Telefone
                return (
                    <PhoneVerificationStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                        phoneTimer={phoneTimer}
                        onResendCode={() => handleResendCode('phone')}
                    />
                );
            case 2: // Senha
                return (
                    <PasswordStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 3: // Dados Pessoais
                return (
                    <PersonalInfoStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 4: // CEP
                return (
                    <CepStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                        handleCepBlur={handleCepBlur}
                    />
                );
            case 5: // Endereço
                return (
                    <AddressStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 6: // Email
                return (
                    <EmailStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                        success={success}
                    />
                );
                case 7: // Verificação de Email
                return (
                    <EmailVerificationStep
                        formValues={formData}
                        handleChange={handleChange}
                        errors={validationErrors}
                        onResendCode={() => handleResendCode('email')}
                        isSubmitting={isSubmitting}
                        resendTimer={resendTimer}
                        onSubmit={verifyEmailCode} // Add this line
                    />
                );
            case 8: // Sucesso
                return <SuccessStep />;
            default:
                return 'Passo desconhecido';
        }
    };

    const getButtonContent = () => {
        if (activeStep === 8) {
            return 'Ir para Login';
        }

        if (activeStep === 7 && isSubmitting) {
            return (
                <>
                    <CircularProgress size={20} color="inherit" />
                    <span style={{ marginLeft: 8 }}>Verificando...</span>
                </>
            );
        }

        return 'Próximo';
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
                                    {steps[activeStep]}
                                </Typography>
                            </Box>

                            <StepProgress
                                activeStep={activeStep}
                                totalSteps={steps.length}
                            />

                            <Box sx={{ my: 4 }}>
                                {getStepContent(activeStep)}
                            </Box>

                            {activeStep < 8 && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 4,
                                        pt: 3,
                                        borderTop: '1px solid rgba(241, 196, 15, 0.1)',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<ArrowBackIcon />}
                                        onClick={handleBack}
                                        disabled={activeStep === 0}
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: 'rgba(241, 196, 15, 0.5)',
                                            color: 'primary.main',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: 'rgba(241, 196, 15, 0.08)',
                                            }
                                        }}
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={activeStep === 7 ? verifyEmailCode : handleNext}
                                        disabled={isSubmitting || isLoading}
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: 'primary.main',
                                            color: 'black',
                                            fontWeight: 600,
                                            '&:hover': {
                                                bgcolor: 'primary.light',
                                            }
                                        }}
                                    >
                                        {getButtonContent()}
                                    </Button>
                                </Box>
                            )}

                            {activeStep === 8 && (
                                <Box textAlign="center" mt={4}>
                                    <CustomButton
                                        variant="contained"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        Ir para Login
                                    </CustomButton>
                                </Box>
                            )}

                            {activeStep < 8 && (
                                <Box textAlign="center" mt={4}>
                                    <Link
                                        component={RouterLink}
                                        to="/login"
                                        sx={{
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Já tem uma conta? Faça login
                                    </Link>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default SignupPage;
