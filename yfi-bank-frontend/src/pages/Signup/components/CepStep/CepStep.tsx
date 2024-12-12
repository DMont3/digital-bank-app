import React, { useState } from 'react';
import { TextField, Box, Alert, CircularProgress } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { validateCEP } from '../../../../utils/validation';
import { formatCEP } from '../../../../utils/formatters';

interface CepStepProps {
  formValues: SignupFormData;
  errors: ValidationError[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCepBlur: (cep: string) => Promise<void>;
}

const CepStep: React.FC<CepStepProps> = ({ 
  formValues, 
  errors, 
  handleChange, 
  handleCepBlur 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const cepError = errors.find(error => error.field === 'cep')?.message;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = formatCEP(value);
    
    const event = {
      ...e,
      target: {
        ...e.target,
        name: 'cep',
        value: formatted
      }
    };
    
    handleChange(event);
  };

  const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep && cep.length === 8 && validateCEP(cep)) {
      setIsLoading(true);
      try {
        await handleCepBlur(cep);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors[0].message}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="CEP"
        name="cep"
        value={formValues.cep || ''}
        onChange={handleCepChange}
        onBlur={onBlur}
        error={!!cepError}
        helperText={cepError}
        disabled={isLoading}
        InputProps={{
          endAdornment: isLoading && <CircularProgress size={20} />,
        }}
        placeholder="00000-000"
      />
    </Box>
  );
};

export default CepStep;
