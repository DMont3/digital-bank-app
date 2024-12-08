import React from 'react';
import { TextField, Box, Alert } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { validateEmail } from '../../../../utils/validation';

interface EmailStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  success?: string;
}

const EmailStep: React.FC<EmailStepProps> = ({ formValues, handleChange, errors, success }) => {
  const emailError = errors.find(error => error.field === 'email')?.message;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    const isValid = validateEmail(value);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value,
        name: 'email'
      }
    };
    
    handleChange(syntheticEvent);
  };

  return (
    <Box>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors[0].message}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formValues.email}
        onChange={handleEmailChange}
        error={!!emailError}
        helperText={emailError || "Digite um email válido"}
        required
        placeholder="exemplo@email.com"
        inputProps={{
          autoComplete: 'email'
        }}
      />
    </Box>
  );
};

export default EmailStep;
