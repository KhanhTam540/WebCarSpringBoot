import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

describe('AdminUsersPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('blocks non-admin users and renders searchable user management with lock/unlock actions for admins', async () => {
    renderWithProviders(<AppRoutes />, { route: '/admin/users' });

    expect(await screen.findByRole('heading', { name: /^đăng nhập$/i })).toBeInTheDocument();

    useAuthStore.setState({
      accessToken: 'user-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });

    renderWithProviders(<AppRoutes />, { route: '/admin/users' });
    expect(await screen.findByRole('heading', { name: /không có quyền truy cập/i })).toBeInTheDocument();

    const user = userEvent.setup();
    let users = [
      {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
        isActive: true,
        createdAt: '2026-03-20T08:00:00',
        roles: ['ROLE_USER'],
      },
      {
        id: 2,
        username: 'bob-admin',
        email: 'bob.admin@example.com',
        isActive: false,
        createdAt: '2026-03-21T09:30:00',
        roles: ['ROLE_ADMIN'],
      },
    ];

    server.use(
      http.get('/api/v1/admin/users', () => HttpResponse.json(users)),
      http.get('/api/v1/admin/users/search', ({ request }) => {
        const email = new URL(request.url).searchParams.get('email');
        const filtered = users.filter((item) => item.email.includes(email ?? ''));
        return HttpResponse.json(filtered);
      }),
      http.put('/api/v1/admin/users/:userId/status', ({ params, request }) => {
        const status = new URL(request.url).searchParams.get('status');
        users = users.map((item) =>
          String(item.id) === String(params.userId)
            ? {
                ...item,
                isActive: status === 'true',
              }
            : item,
        );

        return HttpResponse.text(status === 'true' ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản thành công!');
      }),
    );

    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { username: 'admin', roles: ['ROLE_ADMIN'] },
      cartBadgeCount: 0,
    });

    renderWithProviders(<AppRoutes />, { route: '/admin/users' });

    expect(await screen.findByRole('heading', { name: /quản lý người dùng/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /người dùng/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText(/tìm kiếm theo email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /xem tất cả người dùng/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'alice@example.com' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'bob.admin@example.com' })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tìm kiếm theo email/i), 'bob.admin');

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'bob.admin@example.com' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('cell', { name: 'alice@example.com' })).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText(/tìm kiếm theo email/i));
    await user.click(screen.getByRole('button', { name: /xem tất cả người dùng/i }));

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'alice@example.com' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /khóa tài khoản alice/i }));
    expect(await screen.findByText(/đã khóa tài khoản thành công!/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /mở khóa tài khoản bob-admin/i }));
    expect(await screen.findByText(/đã mở khóa tài khoản!/i)).toBeInTheDocument();
  });
});
