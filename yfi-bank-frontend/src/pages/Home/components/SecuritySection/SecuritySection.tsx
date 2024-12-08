// src/pages/Home/components/SecuritySection/SecuritySection.tsx
import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { SecurityFeature } from '../../../../types/common';

const securityFeatures: SecurityFeature[] = [
    {
        icon: <LockIcon fontSize="large" color="primary" />,
        title: 'Segurança Avançada',
        description: 'Implementamos protocolos de segurança de ponta para proteger seus dados e ativos digitais.',
    },
    {
        icon: <SecurityIcon fontSize="large" color="primary" />,
        title: 'Autenticação em Dois Fatores',
        description: 'Adicione uma camada extra de proteção com a autenticação em dois fatores.',
    },
    {
        icon: <VerifiedUserIcon fontSize="large" color="primary" />,
        title: 'Compliance Rigoroso',
        description: 'Estamos em conformidade com todas as regulamentações financeiras para garantir transparência.',
    },
];

const SecuritySection: React.FC = () => {
    return (
        <Box component="section" sx={{ backgroundColor: '#1e1e1e', color: '#ffffff', paddingY: 8 }}>
            <Container>
                <Typography variant="h2" align="center" gutterBottom color="secondary.main">
                    Segurança e Confiabilidade
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {securityFeatures.map((feature, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
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
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    {feature.icon}
                                    <Typography variant="h5" gutterBottom sx={{ marginTop: 2, color: 'secondary.main' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#f1c40f' }}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default SecuritySection;
