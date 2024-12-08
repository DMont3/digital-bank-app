import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';

interface ContatoHeroSectionProps {
  title?: string;
  subtitle?: string;
}

const HeroSection: React.FC<ContatoHeroSectionProps> = ({
  title = 'Suporte YFI Bank',
  subtitle = 'Nossa equipe está pronta para ajudar você em sua jornada financeira. Escolha o canal de atendimento que melhor atende às suas necessidades.'
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 12,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            color: theme.palette.primary.main,
            textAlign: 'center',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.secondary.main,
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {subtitle}
        </Typography>
      </Container>
    </Box>
  );
};

export default HeroSection;
