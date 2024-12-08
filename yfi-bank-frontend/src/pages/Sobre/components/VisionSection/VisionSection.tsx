import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { VisionItem, AboutSectionProps } from '../../../../types/common';

const VisionSection: React.FC<AboutSectionProps['vision']> = () => {
    const items: VisionItem[] = [
        {
            title: 'Visão',
            content: 'Redefinindo o conceito de banco ao combinar confiança e inovação.'
        },
        {
            title: 'Missão',
            content: 'Entregar soluções financeiras personalizadas com a tecnologia mais avançada e segurança incomparável.'
        }
    ];

    return (
        <Box
            component="section"
            sx={{
                color: '#ffffff',
                paddingY: 12
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6} justifyContent="center" alignItems="stretch">
                    {items.map((item, index) => (
                        <Grid item key={index} xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Box 
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        padding: 6,
                                        borderRadius: 4,
                                    }}
                                >
                                    <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', mb: 4 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: '#f1c40f', flexGrow: 1, lineHeight: 1.6 }}>
                                        {item.content}
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default VisionSection;
