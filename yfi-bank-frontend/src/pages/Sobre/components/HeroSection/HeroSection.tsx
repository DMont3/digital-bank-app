import React from 'react';
import { Box, Typography, Container, Grid, CardMedia } from '@mui/material';
import cryptoSobreImage from '../../../../assets/cryptoSobre.jpg';
import { motion } from 'framer-motion';
import { AboutSectionProps } from '../../../../types/common';

const HeroSection: React.FC<AboutSectionProps['hero']> = () => {
    return (
        <Box
            component="section"
            sx={{
                pt: 12,
                pb: 8,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <CardMedia
                                component="img"
                                image={cryptoSobreImage}
                                alt="Cryptocurrency illustration"
                                sx={{
                                    width: '90%',
                                    height: 350,
                                    objectFit: 'cover',
                                    borderRadius: '16px',
                                    transform: { xs: 'scale(0.9)', md: 'scale(1)' },
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant="h2"
                                component="h1"
                                color="common.white"
                                gutterBottom
                                sx={{ 
                                    fontWeight: 'bold',
                                    mb: 3
                                }}
                            >
                                Conheça o YFI Bank
                            </Typography>
                            <Typography
                                variant="h5"
                                color="primary.main"
                                sx={{
                                    maxWidth: '600px',
                                    opacity: 0.9,
                                    mb: { xs: 4, md: 0 }
                                }}
                            >
                                Reimaginando o que um banco pode fazer por você. Nossa missão é combinar
                                inovação tecnológica com um serviço bancário premium, feito para atender você.
                            </Typography>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default HeroSection;
