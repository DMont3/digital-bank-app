import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';

interface PixSendFormProps {}

const PixSendForm: React.FC<PixSendFormProps> = () => {
  const [amount, setAmount] = useState('0');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/\D/g, '')) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value || '0');
  };

  const handleSendPix = async () => {
    const amountNumber = parseFloat(amount) / 100;
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      enqueueSnackbar('Por favor, insira um valor válido', { variant: 'error' });
      return;
    }

    if (!pixKey) {
      enqueueSnackbar('Por favor, insira uma chave PIX válida', { variant: 'error' });
      return;
    }

    try {
      // Mock de envio de PIX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      enqueueSnackbar('PIX enviado com sucesso!', { variant: 'success' });
      
      // Limpar campos
      setAmount('0');
      setPixKey('');
      setDescription('');
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
      enqueueSnackbar('Ocorreu um erro ao enviar o PIX', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Enviar PIX
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Chave PIX"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Valor"
            type="text"
            value={formatCurrency(amount)}
            onChange={handleAmountChange}
            sx={{ mb: 2 }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
          />
          
          <TextField
            fullWidth
            label="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button 
            variant="contained" 
            onClick={handleSendPix}
            disabled={!amount || !pixKey || amount === '0'}
            fullWidth
          >
            Enviar PIX
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PixSendForm;
