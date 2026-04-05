import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { server } from '../../../test/server';
import { AppRoutes } from '../../../app/routes';
import { useAuthStore } from '../../../store/authStore';
import { LoginPage } from './LoginPage';

function mockHomeCatalogRequests() {
  server.use(
    http.get('/api/v1/brands', () => HttpResponse.json([])),
    http.get('/api/v1/categories', () => HttpResponse.json([])),
    http.get('/api/v1/parts/search', () => HttpResponse.json([])),
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('submits credentials, stores the session, and redirects successful login to home', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/v1/auth/login', async ({ request }) => {
        const body = (await request.json()) as { username: string; password: string };

        expect(body).toEqual({ username: 'alice', password: 'Secret123!' });

        return HttpResponse.json({
          accessToken: 'jwt-token',
          tokenType: 'Bearer',
        });
      }),
      http.get('/api/v1/users/profile', () => {
        return HttpResponse.json({
          username: 'alice',
          email: 'alice@example.com',
          roles: ['ROLE_USER'],
        });
      }),
    );

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<h1>Trang chủ</h1>} />
      </Routes>,
      { route: '/login' },
    );

    await user.type(screen.getByLabelText(/tên đăng nhập/i), 'alice');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'Secret123!');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /trang chủ/i })).toBeInTheDocument();
    });

    expect(useAuthStore.getState().accessToken).toBe('jwt-token');
    expect(useAuthStore.getState().user).toEqual({
      username: 'alice',
      roles: ['ROLE_USER'],
    });
  });

  it('renders an accessible inline error when login fails', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/v1/auth/login', () => {
        return HttpResponse.text('Sai tài khoản hoặc mật khẩu', { status: 401 });
      }),
    );

    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.type(screen.getByLabelText(/tên đăng nhập/i), 'alice');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'WrongPassword1!');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/sai tài khoản hoặc mật khẩu/i);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('redirects authenticated users away from /login', () => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });

    mockHomeCatalogRequests();

    renderWithProviders(<AppRoutes />, { route: '/login' });

    expect(screen.getByRole('heading', { name: /tìm đúng phụ tùng cho đúng đời xe/i })).toBeInTheDocument();
  });
});
