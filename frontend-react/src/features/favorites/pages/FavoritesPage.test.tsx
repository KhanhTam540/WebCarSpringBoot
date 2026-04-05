import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, screen } from '../../../test/utils';
import { server } from '../../../test/server';
import { useAuthStore } from '../../../store/authStore';
import { FavoritesPage } from './FavoritesPage';

describe('FavoritesPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'jwt-token',
      user: { username: 'alice', roles: ['ROLE_USER'] },
      cartBadgeCount: 0,
    });
  });

  it('renders the current user favorite items', async () => {
    server.use(
      http.get('/api/v1/favorites', () =>
        HttpResponse.json([
          {
            id: 1,
            partId: 101,
            sku: 'FAVORITE-101',
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

    renderWithProviders(
      <Routes>
        <Route path="/account/favorites" element={<FavoritesPage />} />
      </Routes>,
      { route: '/account/favorites' },
    );

    expect(await screen.findByRole('heading', { name: /sản phẩm yêu thích/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /má phanh bosch premium/i })).toBeInTheDocument();
  });
});
