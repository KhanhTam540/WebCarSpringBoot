import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../../app/routes';
import { server } from '../../../test/server';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { useAuthStore } from '../../../store/authStore';

describe('AdminPartsPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { username: 'admin', roles: ['ROLE_ADMIN'] },
      cartBadgeCount: 0,
    });
  });

  it('renders parts management with create/update flows plus linked category and compatibility actions', async () => {
    const user = userEvent.setup();
    let parts = [
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
    ];

    const categories = [
      { id: 7, name: 'Phanh', description: 'Danh mục phanh' },
      { id: 8, name: 'Lọc gió', description: 'Danh mục lọc gió' },
    ];

    server.use(
      http.get('/api/v1/admin/parts', () => HttpResponse.json(parts)),
      http.get('/api/v1/admin/categories', () => HttpResponse.json(categories)),
      http.post('/api/v1/admin/parts', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        expect(body).toMatchObject({
          name: 'Lọc gió động cơ Denso',
          sku: 'DENSO-AIR-02',
          categoryId: 8,
        });

        const created = {
          id: 32,
          name: 'Lọc gió động cơ Denso',
          sku: 'DENSO-AIR-02',
          description: 'Lọc gió mới',
          price: 350000,
          stockQuantity: 15,
          imageUrl: 'https://example.com/air-filter.jpg',
          categoryId: 8,
          categoryName: 'Lọc gió',
        };

        parts = [...parts, created];
        return HttpResponse.json(created, { status: 201 });
      }),
      http.put('/api/v1/admin/parts/:id', async ({ params, request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        parts = parts.map((item) =>
          String(item.id) === String(params.id)
            ? {
                ...item,
                ...body,
                categoryName: Number(body.categoryId) === 8 ? 'Lọc gió' : 'Phanh',
              }
            : item,
        );

        return HttpResponse.json(parts.find((item) => String(item.id) === String(params.id)));
      }),
      http.post('/api/v1/admin/parts/:partId/compatibility', ({ request }) => {
        const modelYearId = new URL(request.url).searchParams.get('modelYearId');
        expect(modelYearId).toBe('402');
        return HttpResponse.text('Thiết lập đời xe tương thích thành công!');
      }),
      http.get('/api/v1/admin/brands', () =>
        HttpResponse.json([
          { id: 11, name: 'Toyota', logoUrl: 'https://example.com/toyota.svg' },
          { id: 12, name: 'Honda', logoUrl: 'https://example.com/honda.svg' },
        ]),
      ),
      http.get('/api/v1/admin/models', () =>
        HttpResponse.json([
          { id: 201, name: 'Vios', brandId: 11 },
          { id: 202, name: 'City', brandId: 12 },
        ]),
      ),
      http.get('/api/v1/admin/model-years', () =>
        HttpResponse.json([
          { id: 401, yearNumber: 2021, modelId: 201, modelName: 'Vios' },
          { id: 402, yearNumber: 2022, modelId: 202, modelName: 'City' },
        ]),
      ),
    );

    renderWithProviders(<AppRoutes />, { route: '/admin/parts' });

    expect(await screen.findByRole('heading', { name: /quản lý phụ tùng/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/tên phụ tùng/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mã sku/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lưu phụ tùng/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'BOSCH-BRAKE-01' })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tên phụ tùng/i), 'Lọc gió động cơ Denso');
    await user.type(screen.getByLabelText(/mã sku/i), 'DENSO-AIR-02');
    await user.type(screen.getByLabelText(/giá bán/i), '350000');
    await user.type(screen.getByLabelText(/số lượng tồn kho/i), '15');
    await user.type(screen.getByLabelText(/url hình ảnh/i), 'https://example.com/air-filter.jpg');
    await user.type(screen.getByLabelText(/mô tả/i), 'Lọc gió mới');
    await user.selectOptions(screen.getByLabelText(/chọn danh mục/i), '8');
    await user.click(screen.getByRole('button', { name: /lưu phụ tùng/i }));

    expect(await screen.findByText(/đã lưu phụ tùng thành công!/i)).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'DENSO-AIR-02' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sửa phụ tùng bosch-brake-01/i }));
    await user.clear(screen.getByLabelText(/giá bán/i));
    await user.type(screen.getByLabelText(/giá bán/i), '1350000');
    await user.clear(screen.getByLabelText(/số lượng tồn kho/i));
    await user.type(screen.getByLabelText(/số lượng tồn kho/i), '5');
    await user.click(screen.getByRole('button', { name: /cập nhật phụ tùng/i }));

    expect(await screen.findByText(/đã cập nhật phụ tùng thành công!/i)).toBeInTheDocument();
    expect(screen.getByText(/1.350.000\s*₫/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/phụ tùng cần gán tương thích/i), '31');
    await user.selectOptions(screen.getByLabelText(/hãng xe/i), '12');
    await user.selectOptions(screen.getByLabelText(/dòng xe/i), '202');
    await user.selectOptions(screen.getByLabelText(/đời xe/i), '402');
    await user.click(screen.getByRole('button', { name: /thiết lập tương thích/i }));

    expect(await screen.findByText(/thiết lập đời xe tương thích thành công!/i)).toBeInTheDocument();
  }, 20000);
});
