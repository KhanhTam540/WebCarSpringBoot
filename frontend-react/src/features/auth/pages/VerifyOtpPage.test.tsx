import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { server } from '../../../test/server';
import { useAuthStore } from '../../../store/authStore';
import { AppRoutes } from '../../../app/routes';
import { VerifyOtpPage } from './VerifyOtpPage';

function mockHomeCatalogRequests() {
  server.use(
    http.get('/api/v1/brands', () => HttpResponse.json([])),
    http.get('/api/v1/categories', () => HttpResponse.json([])),
    http.get('/api/v1/parts/search', () => HttpResponse.json([])),
  );
}

describe('VerifyOtpPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('submits username/code via query params and redirects to login on success', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/v1/auth/verify-otp', ({ request }) => {
        const url = new URL(request.url);

        expect(url.searchParams.get('username')).toBe('alice');
        expect(url.searchParams.get('code')).toBe('123456');

        return HttpResponse.text('Xác thực thành công! Tài khoản của bạn đã được kích hoạt.');
      }),
    );

    renderWithProviders(
      <Routes>
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<h1>Đăng nhập</h1>} />
      </Routes>,
      { route: '/verify-otp?username=alice' },
    );

    await user.type(screen.getByLabelText(/mã otp/i), '123456');
    await user.click(screen.getByRole('button', { name: /xác nhận/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /đăng nhập/i })).toBeInTheDocument();
    });
  });

  it('redirects authenticated users away from /verify-otp', () => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });

    mockHomeCatalogRequests();

    renderWithProviders(<AppRoutes />, { route: '/verify-otp?username=alice' });

    expect(screen.getByRole('heading', { name: /tìm đúng phụ tùng cho đúng đời xe/i })).toBeInTheDocument();
  });
});
