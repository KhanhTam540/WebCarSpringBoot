import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen, waitFor, within } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

describe('AdminOrdersPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { username: 'admin', roles: ['ROLE_ADMIN'] },
      cartBadgeCount: 0,
    });
  });

  it('renders admin order management with search and inline status/address updates', async () => {
    const user = userEvent.setup();
    let orders = [
      {
        id: 1001,
        username: 'alice',
        totalPrice: 2500000,
        status: 'PENDING',
        shippingAddress: '12 Nguyen Trai, Quan 1',
        paymentMethod: 'COD',
        createdAt: '2026-03-24T08:00:00',
        items: [],
      },
      {
        id: 1002,
        username: 'bob',
        totalPrice: 4200000,
        status: 'SHIPPING',
        shippingAddress: '99 Le Loi, Quan 3',
        paymentMethod: 'BANK_TRANSFER',
        createdAt: '2026-03-25T09:30:00',
        items: [],
      },
    ];

    server.use(
      http.get('/api/v1/admin/orders', () => HttpResponse.json(orders)),
      http.get('/api/v1/admin/orders/:id', ({ params }) => {
        const found = orders.find((item) => String(item.id) === String(params.id));
        return found
          ? HttpResponse.json(found)
          : HttpResponse.text('Không tìm thấy đơn hàng ID', { status: 400 });
      }),
      http.patch('/api/v1/admin/orders/:id/status', async ({ params, request }) => {
        const body = (await request.json()) as { status: string };
        orders = orders.map((item) =>
          String(item.id) === String(params.id)
            ? {
                ...item,
                status: body.status,
              }
            : item,
        );
        return HttpResponse.text('Cập nhật trạng thái đơn hàng thành công!');
      }),
      http.patch('/api/v1/admin/orders/:id/address', async ({ params, request }) => {
        const body = (await request.json()) as { shippingAddress: string };
        orders = orders.map((item) =>
          String(item.id) === String(params.id)
            ? {
                ...item,
                shippingAddress: body.shippingAddress,
              }
            : item,
        );
        return HttpResponse.text('Cập nhật địa chỉ thành công!');
      }),
    );

    renderWithProviders(<AppRoutes />, { route: '/admin/orders' });

    expect(await screen.findByRole('heading', { name: /quản lý đơn hàng/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/tìm theo mã đơn hàng/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /xem tất cả đơn hàng/i })).toBeInTheDocument();
    expect(screen.getByText(/12 nguyen trai, quan 1/i)).toBeInTheDocument();
    expect(screen.getByText(/99 le loi, quan 3/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tìm theo mã đơn hàng/i), '1002');

    await waitFor(() => {
      expect(screen.getByText(/99 le loi, quan 3/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/12 nguyen trai, quan 1/i)).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText(/tìm theo mã đơn hàng/i));
    await user.click(screen.getByRole('button', { name: /xem tất cả đơn hàng/i }));

    await waitFor(() => {
      expect(screen.getByText(/12 nguyen trai, quan 1/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /chỉnh sửa đơn #1001/i }));

    const editor = await screen.findByRole('region', { name: /cập nhật đơn hàng #1001/i });
    const editorScope = within(editor);

    await user.selectOptions(editorScope.getByLabelText(/trạng thái mới/i), 'SHIPPING');
    await user.clear(editorScope.getByLabelText(/địa chỉ giao hàng/i));
    await user.type(editorScope.getByLabelText(/địa chỉ giao hàng/i), '88 Cach Mang Thang 8, Quan 10');
    await user.click(editorScope.getByRole('button', { name: /lưu thay đổi đơn hàng/i }));

    expect(await screen.findByText(/cập nhật đơn hàng thành công!/i)).toBeInTheDocument();
    expect(await screen.findByText(/88 cach mang thang 8, quan 10/i)).toBeInTheDocument();
    expect(editorScope.getByLabelText(/trạng thái mới/i)).toHaveValue('SHIPPING');
  });
});
