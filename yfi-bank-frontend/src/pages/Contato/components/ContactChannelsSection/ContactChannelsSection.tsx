import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../../components/common/CustomButton/CustomButton';
import { motion } from 'framer-motion';

interface ContactChannel {
  icon: JSX.Element;
  title: string;
  description: string;
  contact: string;
  action: (() => void) | null;
}

const ContactChannelsSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const channels: ContactChannel[] = [
    {
      icon: <EmailIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'E-mail',
      description: 'Entre em contato por e-mail para assuntos relacionados a parcerias empresariais, imprensa e oportunidades de negócio.',
      contact: 'contato@yfibank.com.br',
      action: null
    },
    {
      icon: <ChatIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Chat ao Vivo',
      description: 'Atendimento instantâneo com nossa equipe especializada, disponível de segunda a sexta, das 9h às 18h.',
      contact: 'Iniciar conversa',
      action: () => window.open('https://chat.yfibank.com', '_blank')
    },
    {
      icon: <HelpIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Central de Ajuda',
      description: 'Acesse nossa base de conhecimento com tutoriais, guias e respostas para as dúvidas mais frequentes.',
      contact: 'Acessar central',
      action: () => navigate('/ajuda')
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: theme.palette.background.default,
        py: 8,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.primary.main,
            textAlign: 'center',
            mb: 6,
          }}
        >
          Canais de Atendimento
        </Typography>
        <Grid container spacing={4}>
          {channels.map((channel, index) => (
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
                        {channel.icon}
                      </Box>
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}
                    >
                      {channel.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {channel.description}
                    </Typography>
                    {channel.action ? (
                      <CustomButton
                        onClick={channel.action}
                        variant="contained"
                        fullWidth
                      >
                        {channel.contact}
                      </CustomButton>
                    ) : (
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                        }}
                      >
                        {channel.contact}
                      </Typography>
                    )}
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

export default ContactChannelsSection;
