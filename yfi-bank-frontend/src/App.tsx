// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import HomePage from './pages/Home';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import SobrePage from './pages/Sobre';
import ServicosPage from './pages/Servicos';
import ContatoPage from './pages/Contato';
import DashboardPage from './pages/Dashboard';
import { PrivateRoute } from './components/common/PrivateRoute/PrivateRoute';

const AppContent: React.FC = () => {
    const location = useLocation();
    const hideFooterPaths = ['/login', '/signup'];
    const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Routes>
                    {/* Rotas públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/sobre" element={<SobrePage />} />
                    <Route path="/servicos" element={<ServicosPage />} />
                    <Route path="/contato" element={<ContatoPage />} />

                    {/* Rotas públicas */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </main>
            {shouldShowFooter && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AppContent />
            </Router>
        </ThemeProvider>
    );
};

export default App;
