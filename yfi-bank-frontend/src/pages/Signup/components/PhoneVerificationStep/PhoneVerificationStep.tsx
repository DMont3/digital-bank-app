import React from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import TimerDisplay from '../TimerDisplay/TimerDisplay';
import { styled } from '@mui/material/styles';
import { SignupFormData, ValidationError } from '../../../../types/common';

interface PhoneVerificationStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  phoneTimer: number;
  onResendCode: (type: 'email' | 'phone') => void;
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
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-input': {
      letterSpacing: '0.5em',
      textAlign: 'center'
    }
  },
}));

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  formValues,
  handleChange,
  errors,
  phoneTimer,
  onResendCode
}) => {
  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        Insira o código de verificação de 6 dígitos enviado para o seu telefone.
      </Typography>

      <StyledTextField
        fullWidth
        name="phoneCode"
        label="Código de Verificação"
        value={formValues?.phoneCode || ''}
        onChange={handleChange}
        error={errors.some(error => error.field === 'phoneCode')}
        helperText={errors.find(error => error.field === 'phoneCode')?.message}
        margin="normal"
        inputProps={{
          maxLength: 6,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        {phoneTimer > 0 ? (
          <TimerDisplay timer={phoneTimer} />
        ) : (
          <Button
            variant="text"
            onClick={onResendCode}
            sx={{ textTransform: 'none' }}
          >
            Reenviar código
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PhoneVerificationStep;
