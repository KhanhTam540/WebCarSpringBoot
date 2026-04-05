import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, useAuthStore } from '../../store/authStore';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
