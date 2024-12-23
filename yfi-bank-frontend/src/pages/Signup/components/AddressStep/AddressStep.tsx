import React from 'react';
import { TextField, Box, Alert, Grid } from '@mui/material';
import { SignupFormData, ValidationError } from '../../../../types/common';
import CustomButton from '../../../../components/common/CustomButton/CustomButton';
import { CircularProgress } from '@mui/material';

interface AddressStepProps {
    formValues: SignupFormData;
    errors: ValidationError[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSubmitting: boolean;
}

const AddressStep: React.FC<AddressStepProps> = ({ formValues, errors, handleChange, isSubmitting }) => {
    console.log('AddressStep props:', formValues);
    const streetError = errors?.find((error) => error.field === 'street')?.message;
    const numberError = errors?.find((error) => error.field === 'number')?.message;
    const neighborhoodError = errors?.find((error) => error.field === 'neighborhood')?.message;
    const cityError = errors?.find((error) => error.field === 'city')?.message;
    const stateError = errors?.find((error) => error.field === 'state')?.message;

    return (
        <Box>
            {errors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{errors[0].message}</Alert>}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Endereço"
                        name="street"
                        value={formValues.street}
                        onChange={handleChange}
                        error={!!streetError}
                        helperText={streetError}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Número"
                        name="number"
                        value={formValues.number}
                        onChange={handleChange}
                        error={!!numberError}
                        helperText={numberError}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        label="Complemento"
                        name="complement"
                        value={formValues.complement}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Bairro"
                        name="neighborhood"
                        value={formValues.neighborhood}
                        onChange={handleChange}
                        error={!!neighborhoodError}
                        helperText={neighborhoodError}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        label="Cidade"
                        name="city"
                        value={formValues.city}
                        onChange={handleChange}
                        error={!!cityError}
                        helperText={cityError}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Estado"
                        name="state"
                        value={formValues.state}
                        onChange={handleChange}
                        error={!!stateError}
                        helperText={stateError}
                        required
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddressStep;
