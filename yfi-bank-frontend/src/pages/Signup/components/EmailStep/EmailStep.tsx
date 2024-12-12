import React from 'react';
import { TextField, Box, Alert, Typography } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';

interface EmailStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  success?: string;
}

const EmailStep: React.FC<EmailStepProps> = ({ 
  formValues, 
  handleChange, 
  errors, 
  success 
}) => {
  const emailError = errors.find(error => error.field === 'email')?.message;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'email',
        value
      }
    };
    
    handleChange(syntheticEvent);
  };

  return (
    <Box>
      {emailError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {emailError}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Enviaremos um código de verificação para confirmar seu email.
      </Typography>

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
