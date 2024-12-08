import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/blockchain-pattern.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 3,
                color: theme.palette.primary.main,
                fontWeight: 'bold',
              }}
            >
              Conheça Soluções Financeiras Premium
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              color="secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Serviços feitos para capacitar seu negócio com eficiência, segurança e inovação.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
