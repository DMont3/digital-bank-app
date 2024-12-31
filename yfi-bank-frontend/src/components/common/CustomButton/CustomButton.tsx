import { Button, ButtonPropsColorOverrides } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CustomButtonProps } from '../../../types/common';
import React from 'react';
import { OverridableStringUnion } from '@mui/types';

const StyledButton = styled(Button)<CustomButtonProps>(({ theme, variant = 'contained', color = 'primary' }: {
    theme: any;
    variant?: 'contained' | 'outlined' | 'text';
    color?: OverridableStringUnion<"primary" | "secondary" | "error" | "warning" | "info" | "success" | "inherit", ButtonPropsColorOverrides>;
  }) => ({
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',

    ...(variant === 'contained' && {
        background: theme.palette[color as keyof typeof theme.palette]?.main,
        color: theme.palette.getContrastText(theme.palette[color as keyof typeof theme.palette]?.main ?? theme.palette.primary.main), // Use the specified color for contrast text
        boxShadow: theme.shadows[2],
        '&:hover': {
            background: theme.palette[color as keyof typeof theme.palette]?.light,
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
        }
    }),

    ...(variant === 'outlined' && {
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        '&:hover': {
            background: theme.palette.primary.light,
            transform: 'translateY(-2px)',
        }
    }),

    // Responsive sizes
    ...(theme.breakpoints.down('sm') && {
        padding: '8px 16px',
        fontSize: '0.9rem',
    })
}));

const CustomButton: React.FC<CustomButtonProps> = (props) => {
    return <StyledButton {...props} />;
};

export default CustomButton;
