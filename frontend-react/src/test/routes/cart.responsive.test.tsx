import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { AppRoutes } from '../../app/routes';
import { server } from '../server';
import { renderWithProviders, screen, waitFor } from '../utils';
import { useAuthStore } from '../../store/authStore';

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

function mockCatalogAndCartRequests() {
  server.use(
    http.get('/api/v1/brands', () => HttpResponse.json([])),
    http.get('/api/v1/categories', () => HttpResponse.json([])),
    http.get('/api/v1/parts/search', () => HttpResponse.json([])),
    http.get('/api/v1/cart', () =>
      HttpResponse.json([
        {
          id: 11,
          partId: 501,
          partName: 'Má phanh trước Bosch',
          price: 1200000,
          quantity: 2,
          imageUrl: null,
        },
      ]),
    ),
  );
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'jwt-token',
    user: { username: 'alice', roles: ['ROLE_USER'] },
    cartBadgeCount: 0,
  });
});

afterEach(() => {
  setViewport(1024, 768);
});

describe('cart responsive matrix', () => {
  it('renders mobile route signals at 375x812', async () => {
    setViewport(375, 812);
    mockCatalogAndCartRequests();

    renderWithProviders(<AppRoutes />, { route: '/cart' });

    expect(await screen.findByRole('heading', { name: /giỏ hàng của bạn/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId('cart-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
  });

  it('renders tablet route signals at 768x1024', async () => {
    setViewport(768, 1024);
    mockCatalogAndCartRequests();

    renderWithProviders(<AppRoutes />, { route: '/cart' });

    expect(await screen.findByRole('heading', { name: /giỏ hàng của bạn/i })).toBeInTheDocument();
    expect(screen.getByTestId('cart-tablet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đặt hàng|checkout/i })).toBeInTheDocument();
  });

  it('renders desktop route signals at 1280x800', async () => {
    setViewport(1280, 800);
    mockCatalogAndCartRequests();

    renderWithProviders(<AppRoutes />, { route: '/cart' });

    expect(await screen.findByRole('heading', { name: /giỏ hàng của bạn/i })).toBeInTheDocument();
    expect(screen.getByTestId('cart-desktop')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đặt hàng|checkout/i })).toBeInTheDocument();
  });
});
