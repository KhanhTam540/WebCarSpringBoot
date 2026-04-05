import { afterEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../app/routes';
import { server } from '../server';
import { renderWithProviders, screen, waitFor } from '../utils';

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

function mockHomeRequests() {
  server.use(
    http.get('/api/v1/brands', () => HttpResponse.json([{ id: 1, name: 'Toyota' }])),
    http.get('/api/v1/categories', () => HttpResponse.json([{ id: 7, name: 'Phanh' }])),
    http.get('/api/v1/parts/search', () =>
      HttpResponse.json([
        {
          id: 501,
          sku: 'BOSCH-501',
          name: 'Má phanh Bosch Premium',
          price: 1750000,
          stockQuantity: 12,
          imageUrl: null,
          categoryId: 7,
          categoryName: 'Phanh',
        },
      ]),
    ),
  );
}

afterEach(() => {
  setViewport(1024, 768);
});

describe('home responsive matrix', () => {
  it('renders mobile route signals at 375x812', async () => {
    setViewport(375, 812);
    mockHomeRequests();

    renderWithProviders(<AppRoutes />, { route: '/' });

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByTestId('product-grid-mobile')).toBeInTheDocument();
  });

  it('renders tablet route signals at 768x1024', async () => {
    setViewport(768, 1024);
    mockHomeRequests();

    renderWithProviders(<AppRoutes />, { route: '/' });

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('product-grid-tablet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  it('renders desktop route signals at 1280x800', async () => {
    setViewport(1280, 800);
    mockHomeRequests();

    renderWithProviders(<AppRoutes />, { route: '/' });

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('product-grid-desktop')).toBeInTheDocument();
  });
});
