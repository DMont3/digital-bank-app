import React from 'react';
import { Box, Typography } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>
      <Typography variant="body1">
        Gerencie suas configurações de perfil e segurança.
      </Typography>
    </Box>
  );
};

export default SettingsPage;
