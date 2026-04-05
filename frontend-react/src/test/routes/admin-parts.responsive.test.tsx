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

function mockAdminPartsRequests() {
  server.use(
    http.get('/api/v1/admin/parts', () =>
      HttpResponse.json([
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
      ]),
    ),
    http.get('/api/v1/admin/categories', () => HttpResponse.json([{ id: 7, name: 'Phanh' }])),
    http.get('/api/v1/admin/brands', () => HttpResponse.json([{ id: 11, name: 'Toyota', logoUrl: '' }])),
    http.get('/api/v1/admin/models', () => HttpResponse.json([{ id: 201, name: 'Vios', brandId: 11 }])),
    http.get('/api/v1/admin/model-years', () =>
      HttpResponse.json([{ id: 401, yearNumber: 2021, modelId: 201, modelName: 'Vios' }]),
    ),
  );
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'admin-token',
    user: { username: 'admin', roles: ['ROLE_ADMIN'] },
    cartBadgeCount: 0,
  });
});

afterEach(() => {
  setViewport(1024, 768);
});

describe('admin parts responsive matrix', () => {
  it('renders tablet route signals at 768x1024', async () => {
    setViewport(768, 1024);
    mockAdminPartsRequests();

    renderWithProviders(<AppRoutes />, { route: '/admin/parts' });

    expect(await screen.findByRole('heading', { name: /quản lý phụ tùng/i })).toBeInTheDocument();
    expect(screen.getByTestId('admin-parts-page')).toBeInTheDocument();
    expect(screen.getByLabelText(/tên phụ tùng|part name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
  });

  it('renders desktop route signals at 1280x800', async () => {
    setViewport(1280, 800);
    mockAdminPartsRequests();

    renderWithProviders(<AppRoutes />, { route: '/admin/parts' });

    expect(await screen.findByRole('heading', { name: /quản lý phụ tùng/i })).toBeInTheDocument();
    expect(screen.getByTestId('admin-parts-table')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lưu|save/i })).toBeInTheDocument();
  });
});
