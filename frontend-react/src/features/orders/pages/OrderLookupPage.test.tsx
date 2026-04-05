import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

describe('OrderLookupPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('looks up an order by id and renders canonical shippingAddress and totalPrice fields', async () => {
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

    await user.type(screen.getByLabelText(/mã đơn hàng/i), '888');
    await user.click(screen.getByRole('button', { name: /tra cứu/i }));

    expect(await screen.findByText(/88 cach mang thang 8, quan 10/i, { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(/1.850.000\s*₫/i, { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(/bơm xăng bosch/i)).toBeInTheDocument();
    expect(screen.queryByText(/totalamount/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/address/i)).not.toBeInTheDocument();
  });
});
