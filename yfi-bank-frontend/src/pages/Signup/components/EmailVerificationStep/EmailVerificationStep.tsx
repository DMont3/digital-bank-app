import React from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import TimerDisplay from '../TimerDisplay/TimerDisplay';
import { styled } from '@mui/material/styles';
import { SignupFormData, ValidationError } from '../../../../types/common';

interface EmailVerificationStepProps {
  formValues: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  emailTimer: number;
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

const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  formValues,
  handleChange,
  errors,
  emailTimer,
  onResendCode
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Verificação de Email
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Digite o código de verificação enviado para {formValues.email}
      </Typography>

      <StyledTextField
        fullWidth
        name="emailCode"
        label="Código de Verificação"
        value={formValues.emailCode || ''}
        onChange={handleChange}
        error={errors.some(error => error.field === 'emailCode')}
        helperText={errors.find(error => error.field === 'emailCode')?.message}
        margin="normal"
        inputProps={{
          maxLength: 6,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        {emailTimer > 0 ? (
          <TimerDisplay timer={emailTimer} />
        ) : (
          <Button 
            variant="text" 
            onClick={() => onResendCode('email')}
            sx={{ textTransform: 'none' }}
          >
            Reenviar código
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmailVerificationStep;