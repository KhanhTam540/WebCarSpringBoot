import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

describe('AdminCombosPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { username: 'admin', roles: ['ROLE_ADMIN'] },
      cartBadgeCount: 0,
    });
  });

  it('renders combo management with create, edit and toggle active flows', async () => {
    const user = userEvent.setup();
    let combos = [
      {
        id: 11,
        name: 'Combo bảo dưỡng phanh',
        slug: 'combo-bao-duong-phanh',
        description: 'Combo ưu đãi cho hệ thống phanh.',
        imageUrl: 'https://example.com/combo-brake.jpg',
        discountType: 'PERCENT',
        discountValue: 10,
        active: true,
        items: [
          { partId: 31, partName: 'Má phanh trước Bosch', quantity: 1, sortOrder: 1, imageUrl: null, unitPrice: 1200000 },
        ],
      },
    ];

    const parts = [
      {
        id: 31,
        name: 'Má phanh trước Bosch',
        sku: 'BOSCH-BRAKE-01',
        description: 'Phụ tùng phanh trước',
        price: 1200000,
        stockQuantity: 8,
        imageUrl: 'https://example.com/brake.jpg',
        categoryId: 7,
        categoryName: 'Phanh',
      },
      {
        id: 32,
        name: 'Dầu phanh DOT4',
        sku: 'DOT4-02',
        description: 'Dầu phanh chất lượng cao',
        price: 180000,
        stockQuantity: 20,
        imageUrl: 'https://example.com/dot4.jpg',
        categoryId: 7,
        categoryName: 'Phanh',
      },
    ];

    server.use(
      http.get('/api/v1/admin/combos', () => HttpResponse.json(combos)),
      http.get('/api/v1/admin/parts', () => HttpResponse.json(parts)),
      http.post('/api/v1/admin/combos', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        expect(body).toMatchObject({
          name: 'Combo thay dầu nhanh',
          slug: 'combo-thay-dau-nhanh',
          discountType: 'AMOUNT',
          discountValue: 50000,
        });

        const created = {
          id: 12,
          ...body,
          items: body.items,
        };

        combos = [...combos, created as (typeof combos)[number]];
        return HttpResponse.json(created, { status: 201 });
      }),
      http.put('/api/v1/admin/combos/:id', async ({ params, request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        combos = combos.map((item) =>
          String(item.id) === String(params.id)
            ? {
                ...item,
                ...body,
              }
            : item,
        );

        return HttpResponse.json(combos.find((item) => String(item.id) === String(params.id)));
      }),
      http.patch('/api/v1/admin/combos/:id/active', ({ params, request }) => {
        const active = new URL(request.url).searchParams.get('active') === 'true';
        combos = combos.map((item) =>
          String(item.id) === String(params.id)
            ? {
                ...item,
                active,
              }
            : item,
        );

        return HttpResponse.json(combos.find((item) => String(item.id) === String(params.id)));
      }),
    );

    renderWithProviders(<AppRoutes />, { route: '/admin/combos' });

    expect(await screen.findByRole('heading', { name: /quản lý combo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^combo$/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /sửa combo combo-bao-duong-phanh/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tên combo/i), 'Combo thay dầu nhanh');
    expect(screen.getByLabelText(/slug/i)).toHaveValue('combo-thay-dau-nhanh');
    await user.type(screen.getByLabelText(/url hình ảnh/i), 'https://example.com/combo-oil.jpg');
    await user.type(screen.getByLabelText(/^mô tả$/i), 'Combo cho bảo dưỡng định kỳ.');
    await user.selectOptions(screen.getByLabelText(/kiểu giảm giá/i), 'AMOUNT');
    await user.clear(screen.getByLabelText(/giá trị giảm/i));
    await user.type(screen.getByLabelText(/giá trị giảm/i), '50000');
    await user.selectOptions(screen.getByLabelText(/phụ tùng/i), '32');
    await user.clear(screen.getByLabelText(/số lượng/i));
    await user.type(screen.getByLabelText(/số lượng/i), '2');
    await user.click(screen.getByRole('button', { name: /lưu combo/i }));

    expect(await screen.findByText(/đã tạo combo thành công!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sửa combo combo-thay-dau-nhanh/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sửa combo combo-bao-duong-phanh/i }));
    await user.clear(screen.getByLabelText(/giá trị giảm/i));
    await user.type(screen.getByLabelText(/giá trị giảm/i), '15');
    await user.click(screen.getByRole('button', { name: /cập nhật combo/i }));

    expect(await screen.findByText(/đã cập nhật combo thành công!/i)).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /ẩn combo/i })[0]);
    expect(await screen.findByText(/đã tạm ẩn combo./i)).toBeInTheDocument();
    expect(screen.getAllByText(/đã ẩn/i).length).toBeGreaterThan(0);
  }, 20000);
});
