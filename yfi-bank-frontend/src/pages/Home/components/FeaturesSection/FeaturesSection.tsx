import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { Feature } from '../../../../types/common';

const features: Feature[] = [
    {
        icon: <PaymentIcon fontSize="large" color="primary" />,
        title: 'Transações via PIX',
        description: 'Realize PIX In e PIX Out de forma rápida e segura, com agendamento de transações.',
    },
    {
        icon: <AccountBalanceWalletIcon fontSize="large" color="primary" />,
        title: 'Gerenciamento de Criptomoedas',
        description: 'Compre, venda e gerencie suas criptomoedas com nossa carteira segura e análise de mercado integrada.',
    },
    {
        icon: <BusinessCenterIcon fontSize="large" color="primary" />,
        title: 'Conta Corporativa',
        description: 'Abertura de conta digital para empresas, com funcionalidades como emissão de boletos, pagamentos de contas, transferências internacionais e gestão de múltiplas moedas.',
    },
    {
        icon: <CreditCardIcon fontSize="large" color="primary" />,
        title: 'Cartões Inteligentes',
        description: 'Controle seus gastos, bloqueie instantaneamente e personalize seus cartões com facilidade.',
    },
];

const FeaturesSection: React.FC = () => {
    return (
        <Box
            component="section"
            sx={{
                backgroundColor: '#121212',
                color: '#ffffff',
                paddingY: 8,
                marginTop: { xs: 4, sm: 8 },
            }}
        >
            <Container>
                <Typography variant="h2" align="center" gutterBottom>
                    Nossas Funcionalidades
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item key={index} xs={12} sm={6} md={3}>
                            <Card 
                                sx={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    padding: 3,
                                    height: '100%',
                                    borderRadius: '24px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid rgba(241, 196, 15, 0.1)',
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
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <Box className="feature-icon" sx={{ transition: 'all 0.3s ease' }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ marginTop: 2, color: 'secondary.main' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#f1c40f' }}>{feature.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesSection;
