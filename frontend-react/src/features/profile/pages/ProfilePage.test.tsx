import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { server } from '../../../test/server';
import { AppRoutes } from '../../../app/routes';
import { useAuthStore } from '../../../store/authStore';

describe('ProfilePage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('renders protected profile data and supports OTP-based email/password change flows with inline feedback', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/api/v1/users/profile', () => {
        return HttpResponse.json({
          username: 'alice',
          email: 'alice@example.com',
          roles: ['ROLE_USER'],
        });
      }),
      http.post('/api/v1/users/send-otp-profile', () => {
        return HttpResponse.text('Mã OTP đã được gửi đến email của bạn!');
      }),
      http.post('/api/v1/users/verify-change-email', async ({ request }) => {
        const body = (await request.json()) as { otpCode: string; newEmail: string };
        expect(body).toEqual({ otpCode: '123456', newEmail: 'newalice@example.com' });
        return HttpResponse.text('Đổi email thành công!');
      }),
      http.post('/api/v1/users/verify-change-password', async ({ request }) => {
        const body = (await request.json()) as { otpCode: string; newPassword: string };
        expect(body).toEqual({ otpCode: '654321', newPassword: 'NewSecret123!' });
        return HttpResponse.text('Đổi mật khẩu thành công!');
      }),
    );

    renderWithProviders(<AppRoutes />, { route: '/account/profile' });

    expect(await screen.findByRole('heading', { name: /hồ sơ tài khoản/i })).toBeInTheDocument();
    expect(screen.getByText('alice@example.com', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText('alice', { selector: 'dd' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /gửi mã otp đổi email/i }));
    expect(await screen.findByText(/mã otp đã được gửi đến email của bạn!/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/otp đổi email/i), '123456');
    await user.type(screen.getByLabelText(/email mới/i), 'newalice@example.com');
    await user.click(screen.getByRole('button', { name: /xác nhận đổi email/i }));

    await waitFor(() => {
      expect(screen.getByText('newalice@example.com', { selector: 'dd' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /gửi mã otp đổi mật khẩu/i }));
    expect(await screen.findByText(/mã otp đã được gửi đến email của bạn!/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/otp đổi mật khẩu/i), '654321');
    await user.type(screen.getByLabelText(/^mật khẩu mới$/i), 'NewSecret123!');
    await user.type(screen.getByLabelText(/xác nhận mật khẩu mới/i), 'NewSecret123!');
    await user.click(screen.getByRole('button', { name: /xác nhận đổi mật khẩu/i }));

    expect(await screen.findByText(/đổi mật khẩu thành công/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /quản trị hệ thống/i })).toHaveAttribute('aria-disabled', 'true');
  }, 10000);
});
