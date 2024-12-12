import React from 'react';
import { Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TimerDisplayProps } from '../../../../types/common';

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer, isExpiration = false }) => {
  if (timer <= 0) {
    return isExpiration ? (
      <Box display="flex" alignItems="center" gap={1}>
        <AccessTimeIcon fontSize="small" color="error" />
        <Typography variant="body2" color="error">
          Código expirado
        </Typography>
      </Box>
    ) : null;
  }

  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;

  const displayText = isExpiration
    ? minutes > 0
      ? `Expira em ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
      : `Expira em ${remainingSeconds} segundos`
    : `Aguarde ${minutes}:${remainingSeconds.toString().padStart(2, '0')} para reenviar`;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AccessTimeIcon 
        fontSize="small" 
        color={minutes < 1 ? "warning" : "action"} 
      />
      <Typography 
        variant="body2" 
        color={minutes < 1 ? "warning.main" : "textSecondary"}
      >
        {displayText}
      </Typography>
    </Box>
  );
};

export default TimerDisplay;
