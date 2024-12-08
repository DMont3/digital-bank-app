import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import CryptoSection from './components/CryptoSection/CryptoSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import SecuritySection from './components/SecuritySection/SecuritySection';
import SignupSection from './components/SignupSection/SignupSection';
import FAQSection from './components/FAQSection/FAQSection';

const HomePage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <CryptoSection />
            <FeaturesSection />
            <SecuritySection />
            <SignupSection />
            <FAQSection />
        </>
    );
};

export default HomePage;