import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const CryptoPage: React.FC = () => {
  const navigate = useNavigate();

  const cryptoOptions = [
    {
      title: 'Compra e Venda',
      icon: <CurrencyExchangeIcon sx={{ fontSize: 64 }} />,
      path: '/dashboard/crypto-transaction'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Criptomoedas
      </Typography>
      
      <Grid container spacing={4}>
        {cryptoOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s'
                }
              }}
              onClick={() => navigate(option.path)}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {option.icon}
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {option.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CryptoPage;
