import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomButton from "../CustomButton/CustomButton";
import type { FC } from "react";
import { useAuth } from "../../../hooks/useAuth";

const CTASection: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "#000000",
        py: 10,
        color: "white",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Pronto para uma experiência bancária única?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            paragraph
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Junte-se ao YFI Bank e descubra um novo conceito em serviços financeiros
          </Typography>
          {!user && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <CustomButton
                onClick={() => navigate("/signup")}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: "1.1rem",
                }}
              >
                Abra sua conta
              </CustomButton>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
