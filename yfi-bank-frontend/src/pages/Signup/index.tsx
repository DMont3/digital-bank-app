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
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { api } from '../../services/api';
import CustomButton from '../../components/common/CustomButton/CustomButton';
import { SignupFormData, ValidationError, AddressData, StepValidation } from '../../types/common';
import { validateEmail, validatePhone, validateCPF, validateName, validatePassword, validateCEP } from '../../utils/validation';

// Import components
import StepProgress from './components/StepProgress/StepProgress';
import EmailStep from './components/EmailStep/EmailStep';
import EmailVerificationStep from './components/EmailVerificationStep/EmailVerificationStep';
import PhoneStep from './components/PhoneStep/PhoneStep';
import PhoneVerificationStep from './components/PhoneVerificationStep/PhoneVerificationStep';
import PersonalInfoStep from './components/PersonalInfoStep/PersonalInfoStep';
import CepStep from './components/CepStep/CepStep';
import AddressStep from './components/AddressStep/AddressStep';
import PasswordStep from './components/PasswordStep/PasswordStep';
import SuccessStep from './components/SuccessStep/SuccessStep';

const steps = [
    'Email',
    'Verificação de Email',
    'Telefone',
    'Verificação de Telefone',
    'Dados Pessoais',
    'CEP',
    'Endereço',
    'Senha',
    'Sucesso'
] as const;

type StepType = typeof steps[number];

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [emailTimer, setEmailTimer] = useState<number>(0);
    const [phoneTimer, setPhoneTimer] = useState<number>(0);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [formValues, setFormValues] = useState<SignupFormData>({
        email: '',
        emailCode: '',
        phone: '',
        phoneCode: '',
        name: '',
        cpf: '',
        birthDate: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        password: '',
        confirmPassword: ''
    });

    const startTimer = (type: 'email' | 'phone') => {
        if (type === 'email') {
            setEmailTimer(60);
        } else {
            setPhoneTimer(60);
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
        setValidationErrors([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        clearMessages();
    };

    const sendEmailCode = async () => {
        try {
            await api.post('/auth/verify-email', { email: formValues.email });
            setEmailTimer(60);
            setSuccess('Novo código enviado com sucesso!');
        } catch (err) {
            setError('Erro ao enviar código. Tente novamente.');
        }
    };

    const sendPhoneCode = async () => {
        try {
            setPhoneTimer(60);
            setSuccess('Código enviado para seu telefone');
            setActiveStep(prev => prev + 1);
        } catch (err) {
            setError('Erro ao enviar código. Tente novamente.');
        }
    };

    const verifyPhoneCode = async () => {
        try {
            if (formValues.phoneCode.replace(/\D/g, '').length === 6) {
                setActiveStep(prev => prev + 1);
            } else {
                setError('Código inválido. Por favor, verifique e tente novamente.');
            }
        } catch (err) {
            setError('Código inválido. Por favor, tente novamente.');
        }
    };

    const verifyEmailCode = async () => {
        try {
            await api.post('/auth/verify-email-code', {
                email: formValues.email,
                code: formValues.emailCode
            });
            setSuccess('Email verificado com sucesso!');
            setActiveStep(prev => prev + 1);
        } catch (error: any) {
            setError('Código inválido. Por favor, verifique e tente novamente.');
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: ValidationError[] = [];

        switch (step) {
            case 0: // Email
                if (!formValues.email) {
                    newErrors.push({ field: 'email', message: 'O email é obrigatório' });
                } else if (!validateEmail(formValues.email)) {
                    newErrors.push({ field: 'email', message: 'Email inválido' });
                }
                break;

            case 1: // Email Verification
                if (!formValues.emailCode || formValues.emailCode.replace(/\D/g, '').length !== 6) {
                    newErrors.push({ field: 'emailCode', message: 'Código de verificação inválido' });
                }
                break;

            case 2: // Phone
                if (!formValues.phone) {
                    newErrors.push({ field: 'phone', message: 'O telefone é obrigatório' });
                } else if (!validatePhone(formValues.phone)) {
                    newErrors.push({ field: 'phone', message: 'Telefone inválido' });
                }
                break;

            case 3: // Phone Verification
                if (!formValues.phoneCode || formValues.phoneCode.replace(/\D/g, '').length !== 6) {
                    newErrors.push({ field: 'phoneCode', message: 'Código de verificação inválido' });
                }
                break;

            case 4: // Personal Info
                if (!formValues.name) {
                    newErrors.push({ field: 'name', message: 'O nome é obrigatório' });
                } else if (!validateName(formValues.name)) {
                    newErrors.push({ field: 'name', message: 'Nome inválido. Digite nome e sobrenome.' });
                }

                if (!formValues.cpf) {
                    newErrors.push({ field: 'cpf', message: 'O CPF é obrigatório' });
                } else if (!validateCPF(formValues.cpf)) {
                    newErrors.push({ field: 'cpf', message: 'CPF inválido' });
                }

                if (!formValues.birthDate) {
                    newErrors.push({ field: 'birthDate', message: 'A data de nascimento é obrigatória' });
                } else {
                    const birthDate = new Date(formValues.birthDate);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }

                    if (age < 18) {
                        newErrors.push({ field: 'birthDate', message: 'Você deve ter pelo menos 18 anos' });
                    } else if (age > 120) {
                        newErrors.push({ field: 'birthDate', message: 'Data de nascimento inválida' });
                    }
                }
                break;

            case 5: // CEP
                if (!formValues.cep) {
                    newErrors.push({ field: 'cep', message: 'O CEP é obrigatório' });
                } else if (!validateCEP(formValues.cep)) {
                    newErrors.push({ field: 'cep', message: 'CEP inválido' });
                }
                break;

            case 6: // Address
                if (!formValues.street) {
                    newErrors.push({ field: 'street', message: 'A rua é obrigatória' });
                }
                if (!formValues.number) {
                    newErrors.push({ field: 'number', message: 'O número é obrigatório' });
                }
                if (!formValues.neighborhood) {
                    newErrors.push({ field: 'neighborhood', message: 'O bairro é obrigatório' });
                }
                if (!formValues.city) {
                    newErrors.push({ field: 'city', message: 'A cidade é obrigatória' });
                }
                if (!formValues.state) {
                    newErrors.push({ field: 'state', message: 'O estado é obrigatório' });
                }
                break;

            case 7: // Password
                if (!formValues.password) {
                    newErrors.push({ field: 'password', message: 'A senha é obrigatória' });
                } else {
                    const passwordValidation = validatePassword(formValues.password);
                    if (!passwordValidation.isValid) {
                        newErrors.push(...passwordValidation.errors);
                    }
                }

                if (!formValues.confirmPassword) {
                    newErrors.push({ field: 'confirmPassword', message: 'A confirmação de senha é obrigatória' });
                } else if (formValues.password !== formValues.confirmPassword) {
                    newErrors.push({ field: 'confirmPassword', message: 'As senhas não coincidem' });
                }
                break;
        }

        setValidationErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleNext = async () => {
        // Validate current step
        if (!validateStep(activeStep)) {
            return;
        }

        // Clear messages before proceeding
        clearMessages();

        try {
            // Step-specific actions
            switch (activeStep) {
                case 0: // Email
                    await handleEmailStep();
                    return;
                case 1: // Email Verification
                    await verifyEmailCode();
                    return;
                case 2: // Phone
                    await sendPhoneCode();
                    return;
                case 3: // Phone Verification
                    await verifyPhoneCode();
                    return;
                case 5: // CEP
                    await handleCepBlur(formValues.cep);
                    setActiveStep(prev => prev + 1);
                    return;
                case 7: // Password (Final Step)
                    await handleSubmit();
                    return;
            }

            // Se chegou aqui, avança para o próximo passo
            setActiveStep(prev => prev + 1);
        } catch (error) {
            setError('Ocorreu um erro. Por favor, tente novamente.');
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/auth/register', {
                email: formValues.email,
                password: formValues.password,
                name: formValues.name,
                cpf: formValues.cpf,
                phone: formValues.phone,
                birthDate: formValues.birthDate,
                address: {
                    cep: formValues.cep,
                    street: formValues.street,
                    number: formValues.number,
                    complement: formValues.complement || '',
                    neighborhood: formValues.neighborhood,
                    city: formValues.city,
                    state: formValues.state
                }
            });

            // Atualiza o status de verificação do email e telefone
            await api.post('/auth/update-verification', {
                userId: response.data.user.id,
                type: 'email',
                verified: true
            });

            await api.post('/auth/update-verification', {
                userId: response.data.user.id,
                type: 'phone',
                verified: true
            });

            setActiveStep(activeStep + 1);
        } catch (error: any) {
            console.error('Erro durante o registro:', error.response?.data);
            setError(error.response?.data?.error || 'Erro ao criar conta. Por favor, tente novamente.');
        }
    };

    const handleBack = (): void => {
        clearMessages();
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCepBlur = async (cep: string): Promise<void> => {
        try {
            cep = cep.replace(/\D/g, '');
            if (cep.length !== 8) {
                setError('CEP inválido');
                return;
            }

            const response = await axios.get<AddressData>(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;

            if (data.erro) {
                setError('CEP não encontrado');
                return;
            }

            setFormValues(prev => ({
                ...prev,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
            }));

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao buscar CEP');
            }
        }
    };

    const handleEmailStep = async () => {
        try {
            await api.post('/auth/verify-email', {
                email: formValues.email
            });
            setActiveStep(activeStep + 1);
            setEmailTimer(60);
        } catch (error: any) {
            setValidationErrors([{ field: 'email', message: error.response?.data?.error || 'Erro ao enviar código de verificação' }]);
        }
    };

    const handleEmailVerificationSuccess = () => {
        setActiveStep(activeStep + 1);
        setValidationErrors([]);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (emailTimer > 0) {
            timer = setInterval(() => {
                setEmailTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [emailTimer]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (phoneTimer > 0) {
            timer = setInterval(() => {
                setPhoneTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [phoneTimer]);

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <EmailStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 1:
                return (
                    <EmailVerificationStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                        emailTimer={emailTimer}
                        onResendCode={() => startTimer('email')}
                    />
                );
            case 2:
                return (
                    <PhoneStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 3:
                return (
                    <PhoneVerificationStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                        phoneTimer={phoneTimer}
                        onResendCode={() => startTimer('phone')}
                    />
                );
            case 4:
                return (
                    <PersonalInfoStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                        success={success}
                    />
                );
            case 5:
                return (
                    <CepStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                        handleCepBlur={() => handleCepBlur(formValues.cep)}
                    />
                );
            case 6:
                return (
                    <AddressStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                    />
                );
            case 7:
                return (
                    <PasswordStep
                        formValues={formValues}
                        handleChange={handleChange}
                        errors={validationErrors}
                        success={success}
                    />
                );
            case 8:
                return <SuccessStep />;
            default:
                return null;
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
                                    {steps[activeStep]}
                                </Typography>
                            </Box>

                            <StepProgress
                                activeStep={activeStep}
                                totalSteps={steps.length}
                            />

                            <Box sx={{ my: 4 }}>
                                {renderStep()}
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
                                        onClick={handleNext}
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
                                        {activeStep === 7 ? 'Finalizar' : 'Próximo'}
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
