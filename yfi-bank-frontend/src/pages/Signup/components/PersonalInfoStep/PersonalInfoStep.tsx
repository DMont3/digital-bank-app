import React from 'react';
import { TextField, Box, Typography, Grid } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { validateName, validateCPF } from '../../../../utils/validation';
import { formatCPF } from '../../../../utils/formatters';

interface PersonalInfoStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ formValues, handleChange, errors }) => {
  const nameError = errors.find(error => error.field === 'name')?.message;
  const cpfError = errors.find(error => error.field === 'cpf')?.message;
  const birthDateError = errors.find(error => error.field === 'birthDate')?.message;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const isValid = validateName(value);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value,
        name: 'name'
      }
    };
    
    handleChange(syntheticEvent);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    const isValid = validateCPF(formatted);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'cpf',
        value: formatted
      }
    };
    
    handleChange(syntheticEvent);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value,
        name: 'birthDate'
      }
    };
    
    handleChange(syntheticEvent);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Nome Completo"
            name="name"
            value={formValues.name}
            onChange={handleNameChange}
            error={!!nameError}
            helperText={nameError || "Digite seu nome completo (nome e sobrenome)"}
            required
            placeholder="João Silva"
            inputProps={{
              maxLength: 100,
              autoComplete: 'name'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formValues.cpf}
            onChange={handleCPFChange}
            error={!!cpfError}
            helperText={cpfError || "Digite apenas números"}
            required
            placeholder="000.000.000-00"
            inputProps={{
              maxLength: 14,
              autoComplete: 'off'
            }}
            InputProps={{
              inputMode: 'numeric'
            }}
            FormHelperTextProps={{
              sx: {
                position: 'absolute',
                bottom: '-20px'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Data de Nascimento"
            name="birthDate"
            type="date"
            value={formValues.birthDate}
            onChange={handleBirthDateChange}
            error={!!birthDateError}
            helperText={birthDateError || "Você deve ter pelo menos 18 anos"}
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0],
              min: new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0],
              autoComplete: 'bday'
            }}
            FormHelperTextProps={{
              sx: {
                position: 'absolute',
                bottom: '-20px'
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoStep;
