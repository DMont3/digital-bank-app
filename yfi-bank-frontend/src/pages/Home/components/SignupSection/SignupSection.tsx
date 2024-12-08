import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Link as RouterLink } from 'react-router-dom'; 
import CustomButton from '../../../../components/common/CustomButton/CustomButton';
import { SignupStep } from '../../../../types/common';

const SignupSection: React.FC = () => {
    const steps: SignupStep[] = [
        {
            number: '01',
            title: 'Clique no botão "Abra sua conta"',
            description: 'Clique no botão abaixo para iniciar seu cadastro no YFI Bank.',
            icon: <PersonIcon sx={{ fontSize: 60, color: '#f1c40f' }} />,
        },
        {
            number: '02',
            title: 'Complete seu registro rapidamente e confirme sua conta',
            description: 'Preencha seus dados pessoais e complete a validação para começar a usar o YFI Bank.',
            icon: <PersonIcon sx={{ fontSize: 60, color: '#f1c40f' }} />,
        },
        {
            number: '03',
            title: 'Solicite seu cartão para começar a receber cashback em Bitcoin',
            description: 'Solicite seu cartão inteligente e aproveite benefícios exclusivos.',
            icon: <CreditCardIcon sx={{ fontSize: 60, color: '#f1c40f' }} />,
        },
    ];

    return (
        <Box component="section" sx={{ backgroundColor: '#121212', color: '#ffffff', paddingY: 8 }} id="signup">
            <Container>
                <Typography variant="h2" align="center" gutterBottom>
                    Abra sua conta YFI Bank e solicite seu cartão em três passos simples
                </Typography>
                <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
                    {steps.map((step, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '24px',
                                    padding: 3,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 12px 20px rgba(241, 196, 15, 0.1)',
                                        border: '1px solid rgba(241, 196, 15, 0.3)',
                                        '& .feature-icon': {
                                            color: '#f1c40f',
                                        }
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h3" sx={{ 
                                        position: 'absolute', 
                                        top: 16, 
                                        right: 16, 
                                        opacity: 0.2,
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                        color: '#f1c40f'
                                    }}>
                                        {step.number}
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        pt: 2
                                    }}>
                                        {step.icon}
                                        <Typography variant="h6" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#f1c40f' }}>
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box display="flex" justifyContent="center" sx={{ marginTop: 4 }}>
                    <CustomButton 
                        variant="contained" 
                        component={RouterLink} 
                        to="/signup"
                        sx={{
                            fontSize: '1rem',
                            padding: '14px 28px',
                        }}
                    >
                        Abra sua conta
                    </CustomButton>
                </Box>
            </Container>
        </Box>
    );
};

export default SignupSection;
