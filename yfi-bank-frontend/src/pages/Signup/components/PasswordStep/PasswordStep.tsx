import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import { SignupFormData, ValidationError } from '../../../../types/common';
import { validatePassword } from '../../../../utils/validation';

interface PasswordRequirement {
  key: 'length' | 'uppercase' | 'lowercase' | 'number' | 'special';
  label: string;
  test: RegExp;
}

interface PasswordValidations {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  success?: string;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(['box-shadow', 'border-color', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.3)',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff',
  },
}));

const passwordRequirements: PasswordRequirement[] = [
  { key: 'length', label: 'Mínimo de 8 caracteres', test: /.{8,}/ },
  { key: 'uppercase', label: 'Pelo menos uma letra maiúscula', test: /[A-Z]/ },
  { key: 'lowercase', label: 'Pelo menos uma letra minúscula', test: /[a-z]/ },
  { key: 'number', label: 'Pelo menos um número', test: /[0-9]/ },
  { key: 'special', label: 'Pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)', test: /[!@#$%^&*(),.?":{}|<>]/ },
];

const PasswordStep: React.FC<PasswordStepProps> = ({ formValues, handleChange, errors, success }) => {
  const [validations, setValidations] = useState<PasswordValidations>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [passwordMatch, setPasswordMatch] = useState(false);

  useEffect(() => {
    if (formValues.password) {
      updateValidations(formValues.password);
    }
  }, [formValues.password]);

  useEffect(() => {
    if (formValues.password && formValues.confirmPassword) {
      setPasswordMatch(formValues.password === formValues.confirmPassword);
    } else {
      setPasswordMatch(false);
    }
  }, [formValues.password, formValues.confirmPassword]);

  const updateValidations = (password: string) => {
    setValidations(prev => {
      const newValidations = { ...prev };
      passwordRequirements.forEach(req => {
        newValidations[req.key] = req.test.test(password);
      });
      return newValidations;
    });
  };

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {errors && errors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{errors[0].message}</Alert>}

      <StyledTextField
        fullWidth
        type="password"
        name="password"
        label="Senha"
        value={formValues.password}
        onChange={handleChange}
        error={errors.some(error => error.field === 'password')}
        helperText={errors.find(error => error.field === 'password')?.message}
        margin="normal"
      />

      <StyledTextField
        fullWidth
        type="password"
        name="confirmPassword"
        label="Confirme sua senha"
        value={formValues.confirmPassword}
        onChange={handleChange}
        error={errors.some(error => error.field === 'confirmPassword')}
        helperText={errors.find(error => error.field === 'confirmPassword')?.message || 
                   (formValues.confirmPassword && !passwordMatch ? 'As senhas não coincidem' : '')}
        margin="normal"
      />

      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
        Requisitos da senha:
      </Typography>

      <List dense>
        {passwordRequirements.map((req) => (
          <ListItem key={req.key} sx={{ p: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {validations[req.key] ? (
                <CheckCircleIcon color="success" fontSize="small" />
              ) : (
                <CancelIcon color="error" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={req.label}
              primaryTypographyProps={{
                variant: 'body2',
                color: validations[req.key] ? 'textPrimary' : 'error'
              }}
            />
          </ListItem>
        ))}
        <ListItem sx={{ p: 0 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {passwordMatch && formValues.confirmPassword ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <CancelIcon color="error" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText 
            primary="As senhas devem coincidir"
            primaryTypographyProps={{
              variant: 'body2',
              color: passwordMatch && formValues.confirmPassword ? 'textPrimary' : 'error'
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default PasswordStep;
