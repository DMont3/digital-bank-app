import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useDepositContext } from '../context/DepositContext';
import { useSnackbar } from 'notistack';

const PixDepositForm: React.FC = () => {
  const [amount, setAmount] = useState('0');
  const [pixKey] = useState('123.456.789-09'); // Mocked CPF key
  const [showPix, setShowPix] = useState(false);
  const { addDeposit, depositData } = useDepositContext();
  const { enqueueSnackbar } = useSnackbar();

  const formatCurrency = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    const number = parseFloat(cleanedValue) / 100;
    if (isNaN(number)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(0);
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value || '0');
  };

  const handleGeneratePix = async () => {
    const amountNumber = parseFloat(amount) / 100;
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      enqueueSnackbar('Por favor, insira um valor válido', { variant: 'error' });
      return;
    }

    try {
      // TODO: Integrar com API para gerar QR Code
      const qrCodeData = `pix:${pixKey}?amount=${amountNumber}`;
      
      // Adicionar ao histórico
      addDeposit({
        amount: parseFloat(amount) / 100,
        status: 'pending',
        method: 'PIX',
        transaction_id: `PIX${Date.now()}`
      });

      setShowPix(true);
      enqueueSnackbar('PIX gerado com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      enqueueSnackbar('Ocorreu um erro ao gerar o PIX', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Depósito via PIX
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Valor"
            type="text"
            value={formatCurrency(amount)}
            onChange={handleAmountChange}
            sx={{ mb: 3 }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
          />
          
          <Button 
            variant="contained" 
            onClick={handleGeneratePix}
            disabled={!amount || amount === '0'}
            sx={{ mb: 3 }}
          >
            Gerar PIX
          </Button>
        </Grid>

        {showPix && (
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                QR Code para Pagamento
              </Typography>
              <QRCodeSVG 
                value={`pix:${pixKey}?amount=${parseFloat(amount)/100}`}
                size={256}
                includeMargin={true}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Código PIX:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {`pix:${pixKey}?amount=${parseFloat(amount)/100}`}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PixDepositForm;
