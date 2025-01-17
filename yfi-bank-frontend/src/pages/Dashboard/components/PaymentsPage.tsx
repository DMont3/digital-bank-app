import React from 'react';
import { Box, Grid, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentsIcon from '@mui/icons-material/Payments';
import HistoryIcon from '@mui/icons-material/History';

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();

  const paymentOptions = [
    {
      title: 'PIX',
      icon: <PaymentsIcon sx={{ fontSize: 64 }} />,
      path: '/dashboard/pix'
    },
    {
      title: 'Histórico',
      icon: <HistoryIcon sx={{ fontSize: 64 }} />,
      path: '/dashboard/transaction-history'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Pagamentos
      </Typography>
      
      <Grid container spacing={4}>
        {paymentOptions.map((option, index) => (
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

export default PaymentsPage;
