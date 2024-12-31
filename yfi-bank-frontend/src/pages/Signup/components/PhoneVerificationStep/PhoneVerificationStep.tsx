import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { PhoneVerificationStepProps } from '../../../../types/common'; // Importe a interface atualizada

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  formValues,
  handleChange,
  errors,
  phoneTimer,
  onResendCode,
}) => {
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleResendCode = async () => {
    try {
      await onResendCode(); // Chama a função passada via props
      setVerificationError(null);
    } catch (error) {
      setVerificationError('Falha ao reenviar o código. Tente novamente.');
    }
  };

  return (
    <Box>
      {verificationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {verificationError}
        </Alert>
      )}

      <Typography variant="body2" color="textSecondary" paragraph>
        Enviamos um código de verificação para o seu número de telefone.
      </Typography>

      <TextField
        fullWidth
        name="phoneCode"
        label="Código de Verificação"
        value={formValues.phoneCode || ''}
        onChange={handleChange}
        error={errors.some((error) => error.field === 'phoneCode')}
        helperText={errors.find((error) => error.field === 'phoneCode')?.message}
        margin="normal"
        inputProps={{
          maxLength: 6,
          pattern: '[0-9]*',
          inputMode: 'numeric',
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        {phoneTimer > 0 ? (
          <Typography variant="body2" color="textSecondary">
            Aguarde {phoneTimer} segundos para reenviar o código.
          </Typography>
        ) : (
          <Button
            variant="text"
            onClick={handleResendCode}
            sx={{ textTransform: 'none' }}
          >
            Reenviar Código
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PhoneVerificationStep;