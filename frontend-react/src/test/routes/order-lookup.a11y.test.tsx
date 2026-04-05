import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../app/routes';
import { server } from '../server';
import { renderWithProviders, screen } from '../utils';
import { useAuthStore } from '../../store/authStore';

describe('order lookup accessibility matrix', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('renders lookup form and explicit result DOM signals', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/api/v1/orders/888', () =>
        HttpResponse.json({
          id: 888,
          username: 'alice',
          totalPrice: 1850000,
          status: 'DELIVERED',
          shippingAddress: '88 Cach Mang Thang 8, Quan 10',
          paymentMethod: 'COD',
          createdAt: '2026-03-25T10:15:00',
          items: [
            {
              id: 10,
              partId: 777,
              partName: 'Bơm xăng Bosch',
              quantity: 1,
              price: 1850000,
            },
          ],
        }),
      ),
    );

    renderWithProviders(<AppRoutes />, { route: '/orders/lookup' });

    expect(await screen.findByRole('heading', { name: /tra cứu đơn hàng/i })).toBeInTheDocument();
    expect(screen.getByTestId('order-lookup-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/mã đơn|order id/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tra cứu|lookup/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/mã đơn|order id/i), '888');
    await user.click(screen.getByRole('button', { name: /tra cứu|lookup/i }));

    expect(await screen.findByTestId('order-lookup-result')).toBeInTheDocument();
    expect(screen.getByTestId('order-status')).toBeInTheDocument();
    expect(screen.getByTestId('order-address')).toBeInTheDocument();
    expect(screen.getByTestId('order-total')).toBeInTheDocument();
  });
});
