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

function mockOrdersRequests() {
  server.use(
    http.get('/api/v1/orders', () =>
      HttpResponse.json([
        {
          id: 1002,
          username: 'alice',
          totalPrice: 4200000,
          status: 'SHIPPED',
          shippingAddress: '99 Le Loi, Quan 3',
          paymentMethod: 'BANK_TRANSFER',
          createdAt: '2026-03-25T09:30:00',
          items: [],
        },
      ]),
    ),
  );
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'jwt-token',
    user: { username: 'alice', roles: ['ROLE_USER'] },
    cartBadgeCount: 0,
  });
});

afterEach(() => {
  setViewport(1024, 768);
});

describe('orders responsive matrix', () => {
  it('renders mobile route signals at 375x812', async () => {
    setViewport(375, 812);
    mockOrdersRequests();

    renderWithProviders(<AppRoutes />, { route: '/account/orders' });

    expect(await screen.findByRole('heading', { name: /lịch sử đơn hàng/i })).toBeInTheDocument();
    expect(screen.getByTestId('orders-mobile')).toBeInTheDocument();
    expect(screen.getAllByTestId('order-card').length).toBeGreaterThan(0);
  });

  it('renders tablet route signals at 768x1024', async () => {
    setViewport(768, 1024);
    mockOrdersRequests();

    renderWithProviders(<AppRoutes />, { route: '/account/orders' });

    expect(await screen.findByRole('heading', { name: /lịch sử đơn hàng/i })).toBeInTheDocument();
    expect(screen.getByTestId('orders-tablet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /xem chi tiết đơn #1002/i })).toBeInTheDocument();
  });

  it('renders desktop route signals at 1280x800', async () => {
    setViewport(1280, 800);
    mockOrdersRequests();

    renderWithProviders(<AppRoutes />, { route: '/account/orders' });

    expect(await screen.findByRole('heading', { name: /lịch sử đơn hàng/i })).toBeInTheDocument();
    expect(screen.getByTestId('orders-desktop')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /xem chi tiết đơn #1002/i })).toBeInTheDocument();
  });
});
