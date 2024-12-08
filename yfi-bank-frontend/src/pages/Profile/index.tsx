import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage: React.FC = () => {
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
                        Perfil
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary">Dados Pessoais</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography color="white">Nome: {user.name}</Typography>
                                <Typography color="white">Email: {user.email}</Typography>
                                <Typography color="white">CPF: {user.cpf}</Typography>
                                <Typography color="white">Telefone: {user.phone}</Typography>
                                <Typography color="white">Data de Nascimento: {new Date(user.birthDate).toLocaleDateString()}</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Endereço</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography color="white">CEP: {user.cep}</Typography>
                                <Typography color="white">
                                    {user.street}, {user.number}
                                    {user.complement && ` - ${user.complement}`}
                                </Typography>
                                <Typography color="white">{user.neighborhood}</Typography>
                                <Typography color="white">{user.city} - {user.state}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default ProfilePage;