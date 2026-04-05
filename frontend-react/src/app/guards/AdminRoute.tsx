import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAdmin, selectIsAuthenticated, useAuthStore } from '../../store/authStore';

export function AdminRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
