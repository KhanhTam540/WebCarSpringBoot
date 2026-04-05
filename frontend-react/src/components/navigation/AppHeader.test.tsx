import { beforeEach, describe, expect, it } from 'vitest';
import { AppHeader } from './AppHeader';
import { renderWithProviders, screen } from '../../test/utils';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
    });
    useCartStore.setState({
      badgeCount: 0,
    });
  });

  it('renders public navigation links and the documented header signal', () => {
    renderWithProviders(<AppHeader />);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /web oto react migration/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /giỏ hàng \(0\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /so sánh \(0\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /đăng nhập/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /đăng ký/i })).toBeInTheDocument();
  });

  it('renders authenticated admin links and clears session state on logout', () => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'admin', roles: ['ROLE_ADMIN'] },
      cartBadgeCount: 3,
    });
    useCartStore.setState({
      badgeCount: 3,
    });

    renderWithProviders(<AppHeader />);

    expect(screen.getByRole('link', { name: /lịch sử đơn/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /yêu thích/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /so sánh \(0\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cá nhân/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /quản trị/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /giỏ hàng \(3\)/i })).toBeInTheDocument();

    screen.getByRole('button', { name: /đăng xuất/i }).click();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useCartStore.getState().badgeCount).toBe(0);
  });
});
