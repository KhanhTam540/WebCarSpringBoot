import { beforeEach, describe, expect, it } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '../../test/utils';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../../store/authStore';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('redirects unauthenticated users to /login', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <h1>Cart Page</h1>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: '/cart' },
    );

    expect(screen.getByRole('heading', { name: /login page/i })).toBeInTheDocument();
  });

  it('renders protected content for authenticated users', () => {
    useAuthStore.setState({
      accessToken: 'token',
      user: { username: 'alice', roles: ['USER'] },
      cartBadgeCount: 1,
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <h1>Cart Page</h1>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: '/cart' },
    );

    expect(screen.getByRole('heading', { name: /cart page/i })).toBeInTheDocument();
  });
});
