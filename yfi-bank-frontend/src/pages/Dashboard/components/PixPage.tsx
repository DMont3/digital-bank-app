import React from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const PixPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabValue = location.pathname.includes('deposit') ? 0 : 1;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const route = newValue === 0 ? 'deposit' : 'send';
    navigate(`/dashboard/pix/${route}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        PIX
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Depósito" />
        <Tab label="Enviar/Pagar" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PixPage;
