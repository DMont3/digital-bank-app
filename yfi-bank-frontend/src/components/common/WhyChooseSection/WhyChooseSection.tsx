import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserClock, FaChartLine } from 'react-icons/fa';
import { WhyChooseSectionFeature } from '../../../types/common';

const reasons: WhyChooseSectionFeature[] = [
  {
    icon: <FaShieldAlt />,
    title: "Segurança Avançada",
    description: "Tecnologia blockchain e criptografia de ponta para proteger seus ativos digitais com máxima segurança."
  },
  {
    icon: <FaUserClock />,
    title: "Serviços Premium",
    description: "Atendimento personalizado 24/7 e benefícios exclusivos para nossos clientes empresariais."
  },
  {
    icon: <FaChartLine />,
    title: "Investimentos Inovadores",
    description: "Acesso a produtos financeiros únicos e oportunidades de investimento em criptomoedas."
  }
];

const WhyChooseSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            color="secondary"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Por que escolher o YFI Bank?
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {reasons.map((reason, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: '3rem',
                      mb: 2,
                    }}
                  >
                    {reason.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    color="secondary"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {reason.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    {reason.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseSection;
