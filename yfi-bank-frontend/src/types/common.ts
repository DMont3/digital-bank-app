import { ReactNode } from 'react';
import { ButtonProps, BoxProps, ListItemProps } from '@mui/material';
import { LinkProps as RouterLinkProps } from 'react-router-dom';

// Augment Material-UI types to work with React Router
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        custom: true;
    }
}

// User related types
export interface User {
    id: string;
    name: string;
    email: string;
}

// Route related types
export interface Route {
    path: string;
    element: ReactNode;
}

// Extending MUI's ButtonProps to include RouterLink props
export interface CustomButtonProps extends ButtonProps {
    component?: React.ElementType;
    to?: string;
}

// Contact page types
export interface ContactChannel {
    icon: React.ReactNode;
    title: string;
    description: string;
    contact: string;
    action: (() => void) | null;
}

export interface ContactChannelsSectionProps {
    channels?: ContactChannel[];
}

// Section related types - exactly matching the current implementation
export interface CTASectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

export interface WhyChooseSectionFeature {
    icon: ReactNode;
    title: string;
    description: string;
}

export interface WhyChooseSectionProps {
    features?: WhyChooseSectionFeature[];
}

// Navigation types
export interface NavItem {
    label: string;
    to: string;
}

// Layout component types
export interface HeaderProps {
    navItems?: NavItem[];
}

export interface FooterProps {
    socialLinks?: {
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    };
}

// Home page types

export interface SecurityFeature {
    icon: JSX.Element;
    title: string;
    description: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface SignupStep {
    number: string;
    title: string;
    description: string;
    icon: JSX.Element;
}

export interface Feature {
    icon: JSX.Element;
    title: string;
    description: string;
}

export interface CoinInfo {
    id: string;
    name: string;
    symbol: string;
    icon: string;
}

export interface CryptoData {
    name: string;
    symbol: string;
    icon: string;
    price: string;
    variation: string;
}

export interface SliderSettings {
    dots: boolean;
    infinite: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
    arrows: boolean;
    autoplay: boolean;
    autoplaySpeed: number;
    cssEase: string;
    pauseOnHover: boolean;
    swipe: boolean;
    adaptiveHeight: boolean;
    variableWidth: boolean;
    waitForAnimate: boolean;
    responsive: Array<{
        breakpoint: number;
        settings: {
            slidesToShow: number;
        };
    }>;
}

// Servicos page types

export interface Service {
    icon: JSX.Element;
    title: string;
    description: string;
}

// Signup page types
export interface SignupFormData {
    email: string;
    emailCode: string;
    phoneCode: string;
    phone: string;
    name: string;
    cpf: string;
    birthDate: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    password: string;
    confirmPassword: string;
}

export interface ValidationError {
    field: keyof SignupFormData;
    message: string;
}

export interface AddressData {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

export interface StepValidation {
    isValid: boolean;
    errors: ValidationError[];
}

// Timer related types
export interface TimerDisplayProps {
    timer: number;
}

// About page types
export interface VisionItem {
    title: string;
    content: string;
}

export interface ValueItem {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export interface AboutSectionProps {
    hero?: {};
    vision?: {};
    values?: {};
}

// Login page types
export interface LoginFormData {
    email: string;
    password: string;
}

// Authentication response type
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        // outros campos que o Supabase retorna
    };
    session: {
        access_token: string;
        // outros campos da sessão
    };
}