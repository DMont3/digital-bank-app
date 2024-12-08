import React from 'react';
import { Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TimerDisplayProps } from '../../../../types/common';

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  if (timer <= 0) return null;

  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AccessTimeIcon fontSize="small" color="action" />
      <Typography variant="body2" color="textSecondary">
        Aguarde {`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`} para reenviar
      </Typography>
    </Box>
  );
};

export default TimerDisplay;
