// src/components/layout/Footer/Footer.tsx
import React from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Link as MuiLink,
    IconButton,
} from '@mui/material';
import { FaLinkedin, FaInstagram, FaTwitter, FaBuilding } from 'react-icons/fa';
import { FooterProps } from '../../../types/common';

const Footer: React.FC<FooterProps> = ({
    socialLinks = {
        linkedin: 'https://www.linkedin.com/company/yfi-bank/',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.twitter.com'
    }
}) => {
    return (
        <Box component="footer" sx={{ backgroundColor: '#1e1e1e', color: '#ffffff', paddingY: 6 }}>
            <Container>
                <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">
                    {/* Logotipo e Redes Sociais */}
                    <Grid item xs={12} sm={4} md={3}>
                        <Box display="flex" alignItems="center" flexDirection="column">
                            <Box display="flex" alignItems="center" marginBottom={2}>
                                <FaBuilding size={24} color="#ffffff" /> {/* Mesmo tamanho que no Header */}
                                <Typography variant="h6" component="div" sx={{ marginLeft: 1, color: '#ffffff' }}>
                                    YFI BANK
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton
                                    component="a"
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#ffffff' }}
                                >
                                    <FaLinkedin />
                                </IconButton>
                                <IconButton
                                    component="a"
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#ffffff' }}
                                >
                                    <FaInstagram />
                                </IconButton>
                                <IconButton
                                    component="a"
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#ffffff' }}
                                >
                                    <FaTwitter />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Links Institucionais */}
                    <Grid item xs={12} sm={8} md={6}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" gutterBottom>
                                    Institucional
                                </Typography>
                                <MuiLink href="/sobre" color="inherit" underline="hover" display="block">
                                    Quem somos
                                </MuiLink>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" gutterBottom>
                                    Termos
                                </Typography>
                                <MuiLink href="#terms" color="inherit" underline="hover" display="block">
                                    Termos de uso
                                </MuiLink>
                                <MuiLink href="#privacy" color="inherit" underline="hover" display="block">
                                    Proteção de dados
                                </MuiLink>
                                <MuiLink href="#cookies" color="inherit" underline="hover" display="block">
                                    Aviso de cookies
                                </MuiLink>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" gutterBottom>
                                    Suporte
                                </Typography>
                                <MuiLink href="#support" color="inherit" underline="hover" display="block">
                                    Central de ajuda
                                </MuiLink>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Direitos Reservados */}
                <Box sx={{ borderTop: '1px solid #ffffff', marginTop: 4, paddingTop: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        2024 &copy; Todos os direitos reservados - YFI BANK
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
