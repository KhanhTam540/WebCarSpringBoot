import { beforeEach, describe, expect, it } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, screen } from '../../test/utils';
import { AdminRoute } from './AdminRoute';
import { useAuthStore } from '../../store/authStore';

describe('AdminRoute', () => {
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
        <Route path="/unauthorized" element={<h1>Unauthorized Page</h1>} />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <h1>Admin Users</h1>
            </AdminRoute>
          }
        />
      </Routes>,
      { route: '/admin/users' },
    );

    expect(screen.getByRole('heading', { name: /login page/i })).toBeInTheDocument();
  });

  it('redirects authenticated non-admin users to /unauthorized', () => {
    useAuthStore.setState({
      accessToken: 'token',
      user: { username: 'alice', roles: ['USER'] },
      cartBadgeCount: 0,
    });

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/unauthorized" element={<h1>Unauthorized Page</h1>} />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <h1>Admin Users</h1>
            </AdminRoute>
          }
        />
      </Routes>,
      { route: '/admin/users' },
    );

    expect(screen.getByRole('heading', { name: /unauthorized page/i })).toBeInTheDocument();
  });

  it('renders admin content for admin users', () => {
    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { username: 'admin', roles: ['ADMIN'] },
      cartBadgeCount: 0,
    });

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/unauthorized" element={<h1>Unauthorized Page</h1>} />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <h1>Admin Users</h1>
            </AdminRoute>
          }
        />
      </Routes>,
      { route: '/admin/users' },
    );

    expect(screen.getByRole('heading', { name: /admin users/i })).toBeInTheDocument();
  });
});
