import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen, waitFor, within } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

function mockHomeCatalogRequests() {
  server.use(
    http.get('/api/v1/brands', () => HttpResponse.json([])),
    http.get('/api/v1/categories', () => HttpResponse.json([])),
    http.get('/api/v1/parts/search', () => HttpResponse.json([])),
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('renders cart items, syncs the header badge, updates quantities, removes items, and creates an order from selected rows', async () => {
    const user = userEvent.setup();
    let cartItems = [
      {
        id: 11,
        partId: 501,
        partName: 'Má phanh trước Bosch',
        price: 1200000,
        quantity: 2,
        imageUrl: null,
      },
      {
        id: 12,
        partId: 502,
        partName: 'Lọc gió động cơ Denso',
        price: 350000,
        quantity: 1,
        imageUrl: null,
      },
    ];

    mockHomeCatalogRequests();

    server.use(
      http.get('/api/v1/cart', () => HttpResponse.json(cartItems)),
      http.put('/api/v1/cart/items/:itemId', ({ params, request }) => {
        const url = new URL(request.url);
        const itemId = Number(params.itemId);
        const quantity = Number(url.searchParams.get('quantity'));

        cartItems = cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item));

        return HttpResponse.text('Cập nhật số lượng thành công');
      }),
      http.delete('/api/v1/cart/items/:itemId', ({ params }) => {
        const itemId = Number(params.itemId);
        cartItems = cartItems.filter((item) => item.id !== itemId);
        return HttpResponse.text('Xóa sản phẩm khỏi giỏ hàng thành công');
      }),
      http.post('/api/v1/orders', async ({ request }) => {
        const body = (await request.json()) as {
          address: string;
          paymentMethod: string;
          cartItemIds: number[];
        };

        expect(body).toEqual({
          address: '12 Nguyen Trai, Quan 1',
          paymentMethod: 'COD',
          cartItemIds: [11],
        });

        cartItems = cartItems.filter((item) => !body.cartItemIds.includes(item.id));

        return HttpResponse.json({
          id: 9001,
          username: 'alice',
          totalPrice: 3600000,
          status: 'PENDING',
          shippingAddress: '12 Nguyen Trai, Quan 1',
          paymentMethod: 'COD',
          createdAt: '2026-03-25T16:00:00',
          items: [
            {
              id: 11,
              partId: 501,
              partName: 'Má phanh trước Bosch',
              quantity: 3,
              price: 1200000,
            },
          ],
        });
      }),
    );

    renderWithProviders(<AppRoutes />, { route: '/cart' });

    expect(await screen.findByRole('heading', { name: /giỏ hàng của bạn/i })).toBeInTheDocument();
    expect(screen.getByText(/má phanh trước bosch/i)).toBeInTheDocument();
    expect(screen.getByText(/lọc gió động cơ denso/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /giỏ hàng \(3\)/i })).toBeInTheDocument();
    });

    const summarySection = screen.getByRole('heading', { name: /tổng thanh toán/i }).parentElement;
    expect(summarySection).not.toBeNull();
    expect(within(summarySection as HTMLElement).getByText(/2.750.000\s*₫/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tăng số lượng má phanh trước bosch/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /giỏ hàng \(4\)/i })).toBeInTheDocument();
    });

    expect(within(summarySection as HTMLElement).getByText(/3.950.000\s*₫/i)).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /chọn lọc gió động cơ denso/i }));
    expect(within(summarySection as HTMLElement).getByText(/3.600.000\s*₫/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /xóa lọc gió động cơ denso/i }));

    await waitFor(() => {
      expect(screen.queryByText(/lọc gió động cơ denso/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /giỏ hàng \(3\)/i })).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/địa chỉ giao hàng/i), '12 Nguyen Trai, Quan 1');
    await user.click(screen.getByRole('radio', { name: /thanh toán khi nhận hàng/i }));
    await user.click(screen.getByRole('button', { name: /đặt hàng đã chọn/i }));

    expect(await screen.findByText(/đơn hàng #9001 đã được tạo thành công/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /giỏ hàng \(0\)/i })).toBeInTheDocument();
    });
  });
});
