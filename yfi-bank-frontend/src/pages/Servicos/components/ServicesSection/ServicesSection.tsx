import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaWallet, FaBriefcase, FaBolt, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { Service } from '../../../../types/common';

const services: Service[] = [
  {
    icon: <FaGlobeAmericas />,
    title: "Transações Internacionais Simplificadas",
    description: "Transfira fundos internacionalmente com taxas reduzidas e processamento mais rápido. O YFI Bank utiliza tecnologia blockchain para reduzir custos em até 40% comparado aos bancos tradicionais."
  },
  {
    icon: <FaWallet />,
    title: "Gestão de Ativos Digitais",
    description: "Gerencie múltiplas moedas, incluindo criptomoedas como BTC e USDT, em uma única plataforma segura. Nossas soluções avançadas permitem controle total de ativos digitais."
  },
  {
    icon: <FaBriefcase />,
    title: "Conta Digital Corporativa",
    description: "Abra uma conta digital empresarial e gerencie pagamentos, transferências e folha de pagamento de forma segura e simplificada. Operações disponíveis 24/7."
  },
  {
    icon: <FaBolt />,
    title: "PIX e Pagamentos na Conta Digital",
    description: "Realize pagamentos instantâneos com PIX, diretamente da sua conta digital. Gerencie transferências e pagamentos com rapidez e segurança."
  },
  {
    icon: <FaCreditCard />,
    title: "Cartões Inteligentes",
    description: "Controle os gastos da sua empresa com nossos cartões inteligentes. Personalize, bloqueie ou desbloqueie cartões instantaneamente."
  },
  {
    icon: <FaShieldAlt />,
    title: "Segurança Baseada em Blockchain",
    description: "Todas as transações são protegidas por nossa infraestrutura blockchain, garantindo transparência e reduzindo riscos de fraude."
  }
];

const ServicesSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {services.map((service, index) => (
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
                      <Box
                        component="span"
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: '2.5rem',
                        }}
                      >
                        {service.icon}
                      </Box>
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}
                    >
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {service.description}
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
};

export default ServicesSection;
