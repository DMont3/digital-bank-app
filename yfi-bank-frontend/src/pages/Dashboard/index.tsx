import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/common';
import { formatDate } from '../../utils/formatters';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
            py: 4 
        }}>
            <Container>
                <Paper sx={{ 
                    p: 4,
                    background: 'rgba(30, 30, 30, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(241, 196, 15, 0.1)',
                    borderRadius: 4
                }}>
                    <Typography variant="h4" component="h1" gutterBottom color="primary">
                        Dashboard
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary">Dados Pessoais</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography color="white">Nome: {user.name}</Typography>
                                <Typography color="white">Email: {user.email}</Typography>
                                <Typography color="white">CPF: {user.cpf}</Typography>
                                <Typography color="white">Telefone: {user.phone}</Typography>
                                <Typography color="white">
                                    Data de Nascimento: {formatDate(user.birthDate)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Endereço</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography color="white">CEP: {user.address.cep}</Typography>
                                <Typography color="white">
                                    {user.address.street}, {user.address.number}
                                    {user.address.complement && ` - ${user.address.complement}`}
                                </Typography>
                                <Typography color="white">{user.address.neighborhood}</Typography>
                                <Typography color="white">{user.address.city} - {user.address.state}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default DashboardPage;