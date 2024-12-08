import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection/HeroSection';
import ServicesSection from './components/ServicesSection/ServicesSection';
import WhyChooseSection from '../../components/common/WhyChooseSection/WhyChooseSection';
import CTASection from '../../components/common/CTASection/CTASection';

const Servicos: React.FC = () => {
  return (
    <Box component="main">
      <HeroSection />
      <ServicesSection />
      <WhyChooseSection />
      <CTASection />
    </Box>
  );
};

export default Servicos;
