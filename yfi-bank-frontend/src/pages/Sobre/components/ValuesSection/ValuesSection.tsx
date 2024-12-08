import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useTheme } from '@mui/material/styles';
import { ValueItem, AboutSectionProps } from '../../../../types/common';

const ValuesSection: React.FC<AboutSectionProps['values']> = () => {
    const theme = useTheme();
    
    const values: ValueItem[] = [
        {
            icon: <StarIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
            title: 'Excelência',
            description: 'Os mais altos padrões em cada interação'
        },
        {
            icon: <VisibilityIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
            title: 'Transparência',
            description: 'Sua confiança é nossa prioridade'
        },
        {
            icon: <LightbulbIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
            title: 'Inovação',
            description: 'Soluções financeiras criadas para o futuro'
        }
    ];

    return (
        <Box
            component="section"
            sx={{
                backgroundColor: theme.palette.background.default,
                py: 8
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    component="h2"
                    align="center"
                    color="secondary"
                    gutterBottom
                    sx={{ mb: 6 }}
                >
                    Nossos Valores
                </Typography>
                <Grid container spacing={4}>
                    {values.map((item, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                style={{ height: '100%' }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: 'rgba(30, 30, 30, 0.6)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '24px',
                                        padding: 3,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 12px 20px rgba(241, 196, 15, 0.1)',
                                            border: '1px solid rgba(241, 196, 15, 0.3)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                        <Box sx={{ mb: 2 }}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default ValuesSection;
