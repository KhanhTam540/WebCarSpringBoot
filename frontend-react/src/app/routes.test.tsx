import { describe, expect, it, beforeEach } from 'vitest';
import { AppRoutes } from './routes';
import { renderWithProviders, screen, waitFor } from '../test/utils';
import { useAuthStore } from '../store/authStore';

describe('AppRoutes', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('redirects authenticated users away from /login to /', () => {
    useAuthStore.setState({
      accessToken: 'token',
      user: { username: 'alice', roles: ['USER'] },
      cartBadgeCount: 2,
    });

    renderWithProviders(<AppRoutes />, { route: '/login' });

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /tìm đúng phụ tùng cho đúng đời xe/i })).toBeInTheDocument();
  });

  it('redirects /admin to /admin/users for admins', async () => {
    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { username: 'admin', roles: ['ADMIN'] },
      cartBadgeCount: 0,
    });

    renderWithProviders(<AppRoutes />, { route: '/admin' });

    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /khu vực quản trị/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/đang tải người dùng quản trị/i)).toBeInTheDocument();
    });
  });

  it('renders not found page for unknown routes', () => {
    renderWithProviders(<AppRoutes />, { route: '/does-not-exist' });

    expect(screen.getByRole('heading', { name: /không tìm thấy trang/i })).toBeInTheDocument();
  });
});
