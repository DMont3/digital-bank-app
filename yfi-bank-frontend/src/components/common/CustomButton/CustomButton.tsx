import { Button, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CustomButtonProps } from '../../../types/common';
import React from 'react';

const StyledButton = styled(Button)<CustomButtonProps>(({ theme, variant = 'contained' }) => ({
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    
    ...(variant === 'contained' && {
        background: 'linear-gradient(45deg, #f1c40f 30%, #f39c12 90%)',
        color: '#000',
        boxShadow: '0 3px 5px 2px rgba(241, 196, 15, .3)',
        '&:hover': {
            background: 'linear-gradient(45deg, #f39c12 30%, #f1c40f 90%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 10px 4px rgba(241, 196, 15, .3)',
        }
    }),

    ...(variant === 'outlined' && {
        border: '2px solid #f1c40f',
        color: '#f1c40f',
        '&:hover': {
            border: '2px solid #f39c12',
            background: 'rgba(241, 196, 15, 0.1)',
            transform: 'translateY(-2px)',
        }
    }),

    // Tamanhos responsivos
    ...(theme.breakpoints.down('sm') && {
        padding: '8px 16px',
        fontSize: '0.9rem',
    })
}));

const CustomButton: React.FC<CustomButtonProps> = (props) => {
    return <StyledButton {...props} />;
};

export default CustomButton;