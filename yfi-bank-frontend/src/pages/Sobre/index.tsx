import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import VisionSection from './components/VisionSection/VisionSection';
import ValuesSection from './components/ValuesSection/ValuesSection';
import WhyChooseSection from '../../components/common/WhyChooseSection/WhyChooseSection';
import CTASection from '../../components/common/CTASection/CTASection';

const SobrePage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <VisionSection />
            <ValuesSection />
            <WhyChooseSection />
            <CTASection />
        </>
    );
};

export default SobrePage;
