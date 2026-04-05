import { afterEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../app/routes';
import { server } from '../server';
import { renderWithProviders, screen } from '../utils';

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

function mockProductDetailRequest() {
  server.use(
    http.get('/api/v1/parts/55', () =>
      HttpResponse.json({
        id: 55,
        sku: 'DETAIL-55',
        name: 'Bộ lọc gió hiệu suất cao',
        description: 'Mô tả detail từ endpoint riêng',
        price: 990000,
        stockQuantity: 9,
        imageUrl: 'https://example.com/detail-55.jpg',
        categoryId: 3,
        categoryName: 'Động cơ',
      }),
    ),
  );
}

afterEach(() => {
  setViewport(1024, 768);
});

describe('product detail responsive matrix', () => {
  it('renders mobile route signals at 375x812', async () => {
    setViewport(375, 812);
    mockProductDetailRequest();

    renderWithProviders(<AppRoutes />, { route: '/products/55' });

    expect(await screen.findByRole('heading', { name: /bộ lọc gió hiệu suất cao/i })).toBeInTheDocument();
    expect(screen.getByTestId('product-detail-mobile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm vào giỏ|add to cart/i })).toBeInTheDocument();
    expect(screen.getByAltText(/product|part/i)).toBeInTheDocument();
  });

  it('renders tablet route signals at 768x1024', async () => {
    setViewport(768, 1024);
    mockProductDetailRequest();

    renderWithProviders(<AppRoutes />, { route: '/products/55' });

    expect(await screen.findByRole('heading', { name: /bộ lọc gió hiệu suất cao/i })).toBeInTheDocument();
    expect(screen.getByTestId('product-detail-tablet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm vào giỏ|add to cart/i })).toBeEnabled();
  });

  it('renders desktop route signals at 1280x800', async () => {
    setViewport(1280, 800);
    mockProductDetailRequest();

    renderWithProviders(<AppRoutes />, { route: '/products/55' });

    expect(await screen.findByRole('heading', { name: /bộ lọc gió hiệu suất cao/i })).toBeInTheDocument();
    expect(screen.getByTestId('product-detail-desktop')).toBeInTheDocument();
    expect(screen.getByText(/động cơ/i)).toBeInTheDocument();
  });
});
