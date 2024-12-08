import React from 'react';
import { TextField, Box, Alert } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { validateCEP } from '../../../../utils/validation';
import { formatCEP } from '../../../../utils/formatters';

interface CepStepProps {
  formValues: SignupFormData;
  errors: ValidationError[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCepBlur: (cep: string) => Promise<void>;
}

const CepStep: React.FC<CepStepProps> = ({ formValues, errors, handleChange, handleCepBlur }) => {
  const cepError = errors.find(error => error.field === 'cep')?.message;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCEP(value);
    const isValid = validateCEP(formatted);
    
    // Atualiza o valor do input
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

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value && validateCEP(e.target.value)) {
      handleCepBlur(e.target.value);
    }
  };

  return (
    <Box>
      {errors && errors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{errors[0].message}</Alert>}
      <TextField
        fullWidth
        label="CEP"
        name="cep"
        value={formValues.cep}
        onChange={handleCepChange}
        onBlur={onBlur}
        error={!!cepError}
        helperText={cepError || "Digite o CEP no formato: 00000-000"}
        required
        placeholder="00000-000"
        type="text"
        inputProps={{
          maxLength: 9,
          autoComplete: 'postal-code'
        }}
      />
    </Box>
  );
};

export default CepStep;
