import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import {
  SignupFormData,
  ValidationError,
  AddressData,
  StepValidation,
  CreateUserDTO,
} from "../../types/common";
import {
  validateEmail,
  validatePhone,
  validateCPF,
  validateName,
  validatePassword,
  validateCEP,
} from "../../utils/validation";
import { formatPhone, formatCPF, formatCEP } from "../../utils/formatters"; // Importa os formatters
import { useSignupStore } from "../../stores/signupStore";
import { useAuth } from "../../hooks/useAuth";
import api, {
  sendPhoneCode as sendPhoneCodeApi,
  verifyPhoneCode as verifyPhoneCodeApi,
} from "../../services/api";

// Import components
import StepProgress from "./components/StepProgress/StepProgress";
import PhoneStep from "./components/PhoneStep/PhoneStep";
import PasswordStep from "./components/PasswordStep/PasswordStep";
import PersonalInfoStep from "./components/PersonalInfoStep/PersonalInfoStep";
import CepStep from "./components/CepStep/CepStep";
import AddressStep from "./components/AddressStep/AddressStep.tsx";
import SuccessStep from "./components/SuccessStep/SuccessStep";
import PhoneVerificationStep from "./components/PhoneVerificationStep/PhoneVerificationStep";
import EmailStep from "./components/EmailStep/EmailStep";

const steps = [
  "Telefone",
  "Verificação de Telefone",
  "Email",
  "Senha",
  "Dados Pessoais",
  "CEP",
  "Endereço",
  "Sucesso",
] as const;

type StepType = typeof steps[number];

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    activeStep,
    setActiveStep,
    resetStore,
  } = useSignupStore();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [phoneTimer, setPhoneTimer] = useState<number>(0);
  const [expirationTimer, setExpirationTimer] = useState<number>(600); // 10 minutos em segundos
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [cepLoading, setCepLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { authUser, signup, resetPassword, user, loading } = useAuth();
  const cepDebounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (user !== null && user !== undefined && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate, loading]);

    useEffect(() => {
        let phoneInterval: NodeJS.Timeout;
        let expirationInterval: NodeJS.Timeout;
        // navigationLinks();

        if (phoneTimer > 0) {
            phoneInterval = setInterval(() => {
                setPhoneTimer(prev => Math.max(0, prev - 1));
            }, 1000);
        }

        if (expirationTimer > 0 && activeStep === 1) {
            expirationInterval = setInterval(() => {
                setExpirationTimer(prev => {
                    const newValue = Math.max(0, prev - 1);
                    if (newValue === 0) {
                        // Código expirou
                        setValidationErrors(prev => [...prev, {
                            field: 'phoneCode',
                            message: 'Código expirado. Por favor, solicite um novo código.'
                        }]);
                    }
                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (phoneInterval) clearInterval(phoneInterval);
            if (expirationInterval) clearInterval(expirationInterval);
        };
    }, [phoneTimer, expirationTimer, activeStep]);

    useEffect(() => {
        return () => {
            resetStore();
        };
    }, [resetStore]);

    const startTimer = (type: 'phone') => {
        setPhoneTimer(60);
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

    const sendPhoneCode = async (resend = false) => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            const response = await sendPhoneCodeApi(formData.phone);
            if (response.status === 400) {
                setError(response.data.error || 'Número de telefone já registrado.');
            } else if (response.data.status === 'pending') {
                setSuccess('Código enviado para seu telefone.');
                startTimer('phone');
                if (!resend) {
                    setActiveStep(prev => prev + 1);
                }
            } else {
                throw new Error('Falha ao enviar código de verificação.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Erro ao enviar código. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyPhoneCode = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            const response = await verifyPhoneCodeApi(formData.phone, formData.phoneCode || '');
            if (response.status === 200 && response.data.status === 'approved') {
                setSuccess('Telefone verificado com sucesso.');
                setActiveStep(prev => prev + 1);
            } else {
                setError(response.data?.message || 'Código de verificação inválido.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Erro ao verificar código. Tente novamente.');
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
            case 2: // Email
                if (!formData.email || !validateEmail(formData.email)) {
                    newErrors.push({ field: 'email', message: 'Email inválido.' });
                }
                break;
            case 3: // Senha
                const passwordValidation = validatePassword(formData.password);
                if (!passwordValidation.isValid) {
                    newErrors.push(...passwordValidation.errors);
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.push({ field: 'confirmPassword', message: 'As senhas não coincidem.' });
                }
                break;
            case 4: // Dados Pessoais
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
            case 5: // CEP
                if (!formData.cep || !validateCEP(formData.cep)) {
                    newErrors.push({ field: 'cep', message: 'CEP inválido.' });
                }
                break;
            case 6: // Endereço
                if (!formData.street?.trim()) {
                    newErrors.push({ field: 'street', message: 'Rua inválida.' });
                }
                if (!formData.number?.trim()) {
                    newErrors.push({ field: 'number', message: 'Número inválido.' });
                }
                if (!formData.neighborhood?.trim()) {
                    newErrors.push({ field: 'neighborhood', message: 'Bairro inválido.' });
                }
                if (!formData.city?.trim()) {
                    newErrors.push({ field: 'city', message: 'Cidade inválida.' });
                }
                if (!formData.state?.trim()) {
                    newErrors.push({ field: 'state', message: 'Estado inválido.' });
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
            case 2: // Email - The email existence check is now handled within the EmailStep component.
                setActiveStep(prev => prev + 1);
                break;
            case 6: // Address Step
                await handleSubmit();
                break;
            default:
                setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
        setValidationErrors([]);
    };

    const handleCepBlur = useCallback(async (cep: string) => {
        if (!cep || cep.length !== 8 || formData.cep === cep) {
            return;
        }
    
        try {
            setCepLoading(true);
            console.log('Fetching CEP:', cep);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            console.log('ViaCEP response:', data);
        
            if (data.erro) {
              setValidationErrors((prev) => [
                ...prev,
                { field: 'cep', message: 'CEP não encontrado.' },
              ]);
              return;
            }
        
            const addressData = {
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
              complement: '', // **Correção 1:** Define sempre como vazio
            };
        
            console.log('Updating form data with:', addressData);
            setFormData({ ...formData, ...addressData });
          } catch (error) {
            console.error('Error fetching CEP:', error);
            setValidationErrors((prev) => [
              ...prev,
              { field: 'cep', message: 'Erro ao buscar CEP.' },
            ]);
          } finally {
            setCepLoading(false);
          }
          console.log('formData after cep API call:', formData);
      }, [formData, setFormData, setValidationErrors, setCepLoading])

    const handleResendCode = async (type: 'email' | 'phone') => {
        try {
            setError('');
            setSuccess('');
            setIsSubmitting(true);
            if (type === 'phone') {
                await sendPhoneCode(true);
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

    const handleSubmit = async () => {
        if (!validateStep(6)) { // Valida a etapa de Email antes de prosseguir
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const user: CreateUserDTO = {
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                name: formData.name,
                cpf: formData.cpf,
                birth_date: formData.birthDate,
                address: {
                    cep: formData.cep,
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    neighborhood: formData.neighborhood,
                    city: formData.city,
                    state: formData.state,
                }
            };

            const success = await signup(formData.email, formData.password, user);
            if (success) {
                setActiveStep(7);
            } else {
                setError('Erro ao cadastrar usuário.');
            }
        } catch (error: any) {
            setError(error.message || 'Erro ao cadastrar usuário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <PhoneStep formValues={formData} handleChange={handleChange} errors={validationErrors} setIsSubmitting={setIsSubmitting} />;
            case 1:
                return <PhoneVerificationStep formValues={formData} handleChange={handleChange} errors={validationErrors} onResendCode={() => handleResendCode('phone')} phoneTimer={phoneTimer} />;
            case 2:
                return <EmailStep
                    formValues={formData}
                    handleChange={handleChange}
                    errors={validationErrors}
                    setErrors={setValidationErrors}
                    handleNext={() => setActiveStep(prev => prev + 1)}
                />;
            case 3:
                return <PasswordStep formValues={formData} handleChange={handleChange} errors={validationErrors} />;
            case 4:
                return <PersonalInfoStep formValues={formData} handleChange={handleChange} errors={validationErrors} />;
            case 5:
                return <CepStep formValues={formData} handleChange={handleChange} errors={validationErrors} onBlur={handleCepBlur} isLoading={cepLoading} />;
            case 6:
                return <AddressStep
                    formValues={formData}
                    handleChange={handleChange}
                    errors={validationErrors}
                    isSubmitting={isSubmitting}
                />;
            case 7:
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
                            width: '100%', // Added to control the width
                            minHeight: '350px',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography component="h1" variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                    Cadastro
                                </Typography>
                            </Box>
                            <StepProgress activeStep={activeStep} totalSteps={steps.length} />
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                            <Fade in={!isSubmitting}>
                                <Box mt={3}>
                                    {renderStepContent(activeStep)}
                                </Box>
                            </Fade>
                            <Box mt={3} display="flex" justifyContent="space-between">
                                <Button
                                    disabled={activeStep === 0 || activeStep === 7}
                                    onClick={handleBack}
                                    startIcon={<ArrowBackIcon />}
                                >
                                  Voltar
                            </Button>
                            {activeStep === 6 ? (
                                <CustomButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <CircularProgress size={24} /> : 'Finalizar'}
                                </CustomButton>
                            ) : activeStep < steps.length - 1 ? (
                                <CustomButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    endIcon={<ArrowForwardIcon />}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <CircularProgress size={24} /> : 'Próximo'}
                                </CustomButton>
                            ) : null}
                            </Box>
                            {activeStep !== steps.length - 1 && (
                                <Box mt={2} textAlign="center">
                                    <Link component={RouterLink} to="/login" variant="body2" sx={{ color: '#f1c40f', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
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
