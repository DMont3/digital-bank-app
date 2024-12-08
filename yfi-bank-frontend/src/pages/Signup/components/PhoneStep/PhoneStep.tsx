import React from 'react';
import { TextField, Box, Alert } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { validatePhone } from '../../../../utils/validation';
import { formatPhone } from '../../../../utils/formatters';

interface PhoneStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  success?: string;
}

const PhoneStep: React.FC<PhoneStepProps> = ({ formValues, handleChange, errors, success }) => {
  const phoneError = errors.find(error => error.field === 'phone')?.message;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    const isValid = validatePhone(formatted);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
        name: 'phone'
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
        label="Telefone"
        name="phone"
        value={formValues.phone}
        onChange={handlePhoneChange}
        error={!!phoneError}
        helperText={phoneError || "Digite um número de celular válido com DDD"}
        required
        placeholder="(00) 00000-0000"
        inputProps={{
          maxLength: 15,
          inputMode: 'numeric',
          autoComplete: 'tel'
        }}
      />
    </Box>
  );
};

export default PhoneStep;
