import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../app/routes';
import { server } from '../server';
import { renderWithProviders, screen } from '../utils';
import { useAuthStore } from '../../store/authStore';

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

function mockAdminUsersRequests() {
  server.use(
    http.get('/api/v1/admin/users', () =>
      HttpResponse.json([
        {
          id: 1,
          username: 'alice',
          email: 'alice@example.com',
          isActive: true,
          createdAt: '2026-03-20T08:00:00',
          roles: ['ROLE_USER'],
        },
      ]),
    ),
    http.get('/api/v1/admin/users/search', () => HttpResponse.json([])),
  );
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'admin-token',
    user: { username: 'admin', roles: ['ROLE_ADMIN'] },
    cartBadgeCount: 0,
  });
});

afterEach(() => {
  setViewport(1024, 768);
});

describe('admin users responsive matrix', () => {
  it('renders tablet route signals at 768x1024', async () => {
    setViewport(768, 1024);
    mockAdminUsersRequests();

    renderWithProviders(<AppRoutes />, { route: '/admin/users' });

    expect(await screen.findByRole('heading', { name: /quản lý người dùng/i })).toBeInTheDocument();
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-users-page')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders desktop route signals at 1280x800', async () => {
    setViewport(1280, 800);
    mockAdminUsersRequests();

    renderWithProviders(<AppRoutes />, { route: '/admin/users' });

    expect(await screen.findByRole('heading', { name: /quản lý người dùng/i })).toBeInTheDocument();
    expect(screen.getByTestId('admin-shell-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('admin-users-table')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /khóa tài khoản alice/i })).toBeInTheDocument();
  });
});
