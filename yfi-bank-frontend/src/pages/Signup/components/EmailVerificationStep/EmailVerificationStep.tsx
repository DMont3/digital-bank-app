// src/pages/Signup/components/EmailVerificationStep/EmailVerificationStep.tsx

import React from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';

interface EmailVerificationStepProps {
    formValues: SignupFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: ValidationError[];
    onResendCode: () => Promise<void>;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    isSubmitting: boolean;
    resendTimer: number;
}

const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
    formValues,
    handleChange,
    errors,
    onResendCode,
    onSubmit,
    isSubmitting,
    resendTimer
}) => {
    const [verificationError, setVerificationError] = React.useState<string | null>(null);

    return (
        <Box component="form"> {/* Remover onSubmit */}
            {errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors[0].message}
                </Alert>
            )}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Enviamos um código de verificação para seu email.
                Insira o código abaixo para continuar.
            </Typography>
            <TextField
                fullWidth
                label="Código de Verificação"
                variant="outlined"
                margin="normal"
                name="emailCode"
                value={formValues.emailCode}
                onChange={handleChange}
                error={!!verificationError}
                helperText={verificationError}
                required
                inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="text"
                    onClick={onResendCode}
                    disabled={resendTimer > 0 || isSubmitting}
                    sx={{
                        textTransform: 'none',
                        color: 'primary.main'
                    }}
                >
                    {resendTimer > 0 ? `Aguarde ${resendTimer}s` : 'Reenviar código'}
                </Button>
            </Box>
        </Box>
    );
};

export default EmailVerificationStep;
