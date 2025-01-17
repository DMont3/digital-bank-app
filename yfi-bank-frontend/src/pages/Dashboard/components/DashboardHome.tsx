import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardHome: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Visão Geral
      </Typography>
      <Typography variant="body1">
        Bem-vindo ao seu painel de controle. Aqui você pode acompanhar suas finanças e acessar todas as funcionalidades do YFI Bank.
      </Typography>
    </Box>
  );
};

export default DashboardHome;
