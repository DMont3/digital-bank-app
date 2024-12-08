import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface StepProgressProps {
    activeStep: number;
    totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ activeStep, totalSteps }) => {
    const progress = (activeStep / (totalSteps - 1)) * 100;

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundImage: 'linear-gradient(45deg, #f1c40f 30%, #f39c12 90%)',
                    },
                }}
            />
            <Typography variant="body2" color="textSecondary" align="right" sx={{ mt: 1 }}>
                {`Passo ${activeStep + 1} de ${totalSteps}`}
            </Typography>
        </Box>
    );
};

export default StepProgress;
