import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSignupStore } from '../../stores/signupStore';
import { formatPhone, formatCPF, formatCEP } from '../../utils/formatters';
import { validatePhone, validateCPF, validateName, validatePassword, validateCEP, validateEmail } from '../../utils/validation';
import PhoneStep from './components/PhoneStep/PhoneStep';
import PhoneVerificationStep from './components/PhoneVerificationStep/PhoneVerificationStep';
import EmailStep from './components/EmailStep/EmailStep';
import PasswordStep from './components/PasswordStep/PasswordStep';
import PersonalInfoStep from './components/PersonalInfoStep/PersonalInfoStep';
import CepStep from './components/CepStep/CepStep';
import AddressStep from './components/AddressStep/AddressStep';
import SuccessStep from './components/SuccessStep/SuccessStep';
import StepProgress from './components/StepProgress/StepProgress';
import { ValidationError } from '../../types/common';
import { api } from '../../services/api';

const steps = [
  'Phone',
  'Phone Verification',
  'Email',
  'Password',
  'Personal Info',
  'CEP',
  'Address',
  'Success',
] as const;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, authUser } = useAuth();
  const {
    formData,
    setFormData,
    activeStep,
    setActiveStep,
    isSubmitting,
    setIsSubmitting,
    resetStore,
  } = useSignupStore();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [phoneTimer, setPhoneTimer] = useState(60);

  // Timer countdown for phone verification
  useEffect(() => {
    if (phoneTimer > 0) {
      const interval = setInterval(() => setPhoneTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [phoneTimer]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle CEP blur (fetch address data)
  const handleCepBlur = async (cep: string) => {
    try {
      const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data && !response.data.erro) {
        const { logradouro, bairro, localidade, uf } = response.data;
        setFormData({
          ...formData,
          street: logradouro,
          neighborhood: bairro,
          city: localidade,
          state: uf,
        });
      } else {
        setValidationErrors([{ field: 'cep', message: 'CEP not found' }]);
      }
    } catch (error) {
      setValidationErrors([{ field: 'cep', message: 'Error fetching CEP data' }]);
    }
  };

  // Validate current step
  const validateStep = () => {
    const errors: ValidationError[] = [];
  
    switch (steps[activeStep]) {
      case 'Phone':
        if (!formData.phone || !validatePhone(formData.phone)) {
          errors.push({ field: 'phone', message: 'Invalid phone number' });
        }
        break;
      case 'Phone Verification':
        if (!formData.phoneCode) {
          errors.push({ field: 'phoneCode', message: 'Verification code is required' });
        }
        break;
      case 'Email':
        if (!formData.email || !validateEmail(formData.email)) {
          errors.push({ field: 'email', message: 'Invalid email address' });
        }
        break;
      case 'Password':
        if (!formData.password || !validatePassword(formData.password).isValid) {
          errors.push({ field: 'password', message: 'Password does not meet requirements' });
        }
        if (formData.password !== formData.confirmPassword) {
          errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        }
        break;
      case 'Personal Info':
        if (!formData.name || !validateName(formData.name)) {
          errors.push({ field: 'name', message: 'Invalid name' });
        }
        if (!formData.cpf || !validateCPF(formData.cpf)) {
          errors.push({ field: 'cpf', message: 'Invalid CPF' });
        }
        break;
      case 'CEP':
        if (!formData.cep || !validateCEP(formData.cep)) {
          errors.push({ field: 'cep', message: 'Invalid CEP' });
        }
        break;
      default:
        break;
    }
  
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle next step
  const handleNext = async () => {
    if (!validateStep()) return;
  
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
  
      if (steps[activeStep] === 'Phone') {
        // Send phone verification code
        await api.post('/auth/send-verification-code', { phone: formData.phone });
        setPhoneTimer(60);
        setActiveStep((prev) => prev + 1);
      } else if (steps[activeStep] === 'Phone Verification') {
        // Verify phone code
        await api.post('/auth/verify-code', { code: formData.phoneCode, phone: formData.phone });
        setActiveStep((prev) => prev + 1);
      } else if (steps[activeStep] === 'Address') {
        // Register user with Supabase
        const user = await signUp(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone,
          cpf: formData.cpf,
          birthDate: formData.birthDate,
          address: {
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
          },
        });
  
        // Check if the user is logged in after signup
        if (!authUser) {
          throw new Error('User not logged in after signup');
        }

        // Only proceed to the next step if signUp is successful
        if (user) {
          setActiveStep((prev) => prev + 1);
        } else {
          throw new Error('Signup failed');
        }
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Render current step content
  const getStepContent = (step: number) => {
    switch (steps[step]) {
      case 'Phone':
        return (
          <PhoneStep
            formValues={formData}
            handleChange={handleChange}
            errors={validationErrors}
            onResendCode={async () => {
              await api.post('/auth/send-verification-code', { phone: formData.phone });
              setPhoneTimer(60);
            }}
          />
        );
      case 'Phone Verification':
        return (
          <PhoneVerificationStep
            formValues={formData}
            handleChange={handleChange}
            errors={validationErrors}
            phoneTimer={phoneTimer}
            onResendCode={async () => {
              await api.post('/auth/send-verification-code', { phone: formData.phone });
              setPhoneTimer(60);
            }}
          />
        );
      case 'Email':
        return <EmailStep formValues={formData} handleChange={handleChange} errors={validationErrors} />;
      case 'Password':
        return <PasswordStep formValues={formData} handleChange={handleChange} errors={validationErrors} />;
      case 'Personal Info':
        return <PersonalInfoStep formValues={formData} handleChange={handleChange} errors={validationErrors} />;
      case 'CEP':
        return <CepStep formValues={formData} handleChange={handleChange} errors={validationErrors} handleCepBlur={handleCepBlur} />;
      case 'Address':
        return <AddressStep formValues={formData} handleChange={handleChange} errors={validationErrors} />;
      case 'Success':
        return <SuccessStep />;
      default:
        return <Typography>Step not found</Typography>;
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
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {steps[activeStep]}
              </Typography>
            </Box>

            <StepProgress activeStep={activeStep} totalSteps={steps.length} />

            <Box sx={{ my: 4 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {getStepContent(activeStep)}
            </Box>

            {activeStep < steps.length - 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(241, 196, 15, 0.1)' }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0 || isSubmitting}
                  sx={{
                    borderRadius: 2,
                    borderColor: 'rgba(241, 196, 15, 0.5)',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(241, 196, 15, 0.08)',
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Next'}
                </Button>
              </Box>
            )}

            {activeStep === steps.length - 1 && (
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Go to Login
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SignupPage;