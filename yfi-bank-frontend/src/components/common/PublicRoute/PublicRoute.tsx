import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { CircularProgress, Box, Alert } from '@mui/material';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({
  children,
  redirectTo = '/dashboard',
}: PublicRouteProps) {
  const { user, authUser, loading, error } = useAuth();

  console.log(
    '[PublicRoute] user:',
    user,
    'authUser:',
    authUser,
    'loading:',
    loading,
    'error:',
    error
  );

  if (loading || (!authUser && user)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao verificar autenticação: {error}
          <Box component="p" sx={{ mt: 1 }}>
            Tente recarregar a página ou entre em contato com o suporte.
          </Box>
        </Alert>
      </Box>
    );
  }

  // Redirect authenticated users to dashboard
  if (authUser || user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
