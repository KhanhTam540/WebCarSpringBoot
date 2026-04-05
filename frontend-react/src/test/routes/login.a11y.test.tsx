import { beforeEach, describe, expect, it } from 'vitest';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { renderWithProviders, screen } from '../utils';
import { useAuthStore } from '../../store/authStore';

describe('login accessibility matrix', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
  });

  it('renders the auth form and accessible controls', () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/email|username|tên đăng nhập/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password|mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login|sign in|đăng nhập/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
