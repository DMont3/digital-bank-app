import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../../components/common/CustomButton/CustomButton';

const SuccessStep: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleOutlineIcon
        sx={{
          fontSize: 80,
          color: '#69f0ae',
          mb: 3
        }}
      />
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 600,
          mb: 2
        }}
      >
        Conta criada com sucesso!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          mb: 3
        }}
      >
        Você já pode fazer login na sua conta YFI Bank.
      </Typography>
      <CustomButton onClick={() => navigate('/dashboard')}>
        Acessar o dashboard
      </CustomButton>
    </Box>
  );
};

export default SuccessStep;
