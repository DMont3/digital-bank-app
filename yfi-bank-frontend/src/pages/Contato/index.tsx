import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection/HeroSection';
import ContactChannelsSection from './components/ContactChannelsSection/ContactChannelsSection';
import WhyChooseSection from '../../components/common/WhyChooseSection/WhyChooseSection';
import CTASection from '../../components/common/CTASection/CTASection';

const Contato: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <HeroSection />
      <ContactChannelsSection />
      <WhyChooseSection />
      <CTASection />
    </Box>
  );
};

export default Contato;
