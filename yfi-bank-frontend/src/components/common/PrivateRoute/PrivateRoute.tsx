import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  console.log('[PrivateRoute] user:', user, 'loading:', loading);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
