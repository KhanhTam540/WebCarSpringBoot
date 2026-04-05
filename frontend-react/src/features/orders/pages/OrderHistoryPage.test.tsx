import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

describe('OrderHistoryPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('renders order history newest-first and uses canonical order fields when expanding details', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/api/v1/orders', () =>
        HttpResponse.json([
          {
            id: 1001,
            username: 'alice',
            totalPrice: 2500000,
            status: 'PROCESSING',
            shippingAddress: '12 Nguyen Trai, Quan 1',
            paymentMethod: 'COD',
            createdAt: '2026-03-24T08:00:00',
            items: [],
          },
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
      http.get('/api/v1/orders/1002', () =>
        HttpResponse.json({
          id: 1002,
          username: 'alice',
          totalPrice: 4200000,
          status: 'SHIPPED',
          shippingAddress: '99 Le Loi, Quan 3',
          paymentMethod: 'BANK_TRANSFER',
          createdAt: '2026-03-25T09:30:00',
          items: [
            {
              id: 1,
              partId: 900,
              partName: 'Giảm xóc sau KYB',
              quantity: 2,
              price: 2100000,
            },
          ],
        }),
      ),
    );

    renderWithProviders(<AppRoutes />, { route: '/account/orders' });

    expect(await screen.findByRole('heading', { name: /lịch sử đơn hàng/i })).toBeInTheDocument();

    const orderCards = await screen.findAllByTestId('order-card');
    expect(orderCards).toHaveLength(2);
    expect(orderCards[0]).toHaveTextContent(/#1002/i);
    expect(orderCards[1]).toHaveTextContent(/#1001/i);

    await user.click(screen.getByRole('button', { name: /xem chi tiết đơn #1002/i }));

    expect(await screen.findByText(/99 le loi, quan 3/i, { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(/4.200.000\s*₫/i, { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(/giảm xóc sau kyb/i)).toBeInTheDocument();
    expect(screen.queryByText(/totalamount/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/address/i)).not.toBeInTheDocument();
  });
});
