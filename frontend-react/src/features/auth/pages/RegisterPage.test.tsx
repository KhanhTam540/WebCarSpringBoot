import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Routes, Route, useLocation } from 'react-router-dom';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { server } from '../../../test/server';
import { useAuthStore } from '../../../store/authStore';
import { RegisterPage } from './RegisterPage';

function VerifyOtpRouteProbe() {
  const location = useLocation();

  return (
    <>
      <h1>Xác thực OTP</h1>
      <p data-testid="verify-otp-search">{location.search}</p>
    </>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('submits registration then redirects to verify-otp with the username in query params', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/v1/auth/register', async ({ request }) => {
        const body = (await request.json()) as { username: string; email: string; password: string };

        expect(body).toEqual({
          username: 'alice',
          email: 'alice@example.com',
          password: 'Secret123!',
        });

        return HttpResponse.text('Đăng ký thành công! Vui lòng kiểm tra Email để nhận mã OTP xác thực.');
      }),
    );

    renderWithProviders(
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpRouteProbe />} />
      </Routes>,
      { route: '/register' },
    );

    await user.type(screen.getByLabelText(/tên đăng nhập/i), 'alice');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/^mật khẩu$/i), 'Secret123!');
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /xác thực otp/i })).toBeInTheDocument();
    });
    expect(screen.getByTestId('verify-otp-search')).toHaveTextContent(/username=alice/);
  });

  it('shows accessible validation feedback instead of browser alerts', async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />, { route: '/register' });

    await user.type(screen.getByLabelText(/tên đăng nhập/i), 'alice');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/^mật khẩu$/i), 'weak');
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/mật khẩu/i);
  });
});
