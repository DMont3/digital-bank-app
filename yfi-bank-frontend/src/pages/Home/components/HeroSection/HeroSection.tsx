import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import heroImage from "../../../../assets/hero.jpg";
import { motion, Variants } from "framer-motion";
import CustomButton from "../../../../components/common/CustomButton/CustomButton";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const fadeInUp: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer: Variants = {
    visible: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#ffffff",
        paddingTop: "60px",
        display: "flex",
        alignItems: "center",
      }}
      id="home"
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    marginBottom: 3,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Seu parceiro no futuro financeiro.
                </Typography>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h5"
                  gutterBottom
                  color="text.secondary"
                  sx={{
                    marginBottom: 4,
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  Soluções digitais para gerenciar PIX, criptomoedas e cartões,
                  com segurança e transparência.
                </Typography>
              </motion.div>
              {!user && (
                <motion.div variants={fadeInUp}>
                  <CustomButton
                    variant="contained"
                    component={RouterLink}
                    to="/signup"
                    sx={{
                      fontSize: { xs: "0.9rem", md: "0.9rem" },
                      padding: "15px 30px",
                    }}
                  >
                    Abra sua conta
                  </CustomButton>
                </motion.div>
              )}
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card sx={{ maxWidth: "100%", margin: "0 auto", backgroundColor: "#1e1e1e", borderRadius: "12px" }}>
                <CardMedia
                  component="img"
                  height="500"
                  image={heroImage}
                  alt="Ilustração de serviços bancários digitais"
                />
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
