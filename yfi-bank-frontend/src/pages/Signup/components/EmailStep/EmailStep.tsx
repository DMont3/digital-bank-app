import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Box, Alert } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { useAuth } from '../../../../hooks/useAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface EmailStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  errors: ValidationError[];
  setErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
}

const EmailStep: React.FC<EmailStepProps> = ({ formValues, handleChange, handleNext, errors, setErrors }) => {
  const [loading, setLoading] = useState(false);
  const emailError = errors?.find(error => error.field === 'email')?.message;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: 'email',
        value
      }
    });
  };

  const checkEmailExists = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email);

      if (error) {
        console.error("Error checking email:", error);
        return false;
      }
      return data.length > 0;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const validateEmail = async () => {
      if (formValues.email) {
        const emailExists = await checkEmailExists(formValues.email);
        if (emailExists) {
          setErrors(prevErrors => [...prevErrors, { field: 'email', message: 'Este email já está cadastrado.' }]);
        } else {
          const newErrors = errors.filter(error => error.field !== 'email');
          setErrors(newErrors);
        }
      }
    };

    validateEmail();
  }, [checkEmailExists, errors, formValues.email, setErrors]);

  return (
    <Box>
      {emailError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {emailError}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formValues.email || ''}
        onChange={handleEmailChange}
        error={!!emailError}
        helperText={emailError}
        placeholder="exemplo@email.com"
        sx={{ mt: 2 }}
      />
    </Box>
    );
};

export default EmailStep;
