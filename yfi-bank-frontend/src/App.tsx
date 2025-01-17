// src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
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
import DashboardHome from './pages/Dashboard/components/DashboardHome';
import BalancePage from './pages/Dashboard/components/BalancePage';
import CryptoPage from './pages/Dashboard/components/CryptoPage';
import PaymentsPage from './pages/Dashboard/components/PaymentsPage';
import SettingsPage from './pages/Dashboard/components/SettingsPage';
import TransactionHistory from './pages/Dashboard/components/TransactionHistory';
import CryptoTransactionPage from './pages/Dashboard/components/CryptoTransactionPage';
import PixPage from './pages/Dashboard/components/PixPage';
import PixSendForm from './pages/Dashboard/components/PixSendForm';
import PixDepositForm from './pages/Dashboard/components/PixDepositForm';
import { PrivateRoute } from './components/common/PrivateRoute/PrivateRoute';
import { PublicRoute } from './components/common/PublicRoute/PublicRoute';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './stores/authStore';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/signup'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  const { user, loading } = useAuth();
  const { isAuthenticated } = useAuthStore();

  console.log('[AppContent] isAuthenticated:', isAuthenticated, 'user:', user);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Rotas públicas */}
          {/* Rotas acessíveis a todos */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/contato" element={<ContatoPage />} />

          {/* Rotas restritas a usuários não autenticados */}
          <Route
            path="/signup"
            element={
              <PublicRoute redirectTo="/dashboard">
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute redirectTo="/dashboard">
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Rotas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="balance" element={<BalancePage />} />
            <Route path="crypto" element={<CryptoPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="transaction-history" element={<TransactionHistory />} />
            <Route path="crypto-transaction" element={<CryptoTransactionPage />} />
            <Route path="pix" element={<PixPage />}>
              <Route path="send" element={<PixSendForm />} />
              <Route path="deposit" element={<PixDepositForm />} />
            </Route>
          </Route>
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
