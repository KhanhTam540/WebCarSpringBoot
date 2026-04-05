import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, screen } from '../../../test/utils';
import { server } from '../../../test/server';
import { useCompareStore } from '../../../store/compareStore';
import { ComparePage } from './ComparePage';

describe('ComparePage', () => {
  beforeEach(() => {
    useCompareStore.setState({ partIds: [101, 202] });
  });

  it('renders comparison data for two selected products', async () => {
    server.use(
      http.get('/api/v1/compare', () =>
        HttpResponse.json({
          parts: [
            {
              id: 101,
              sku: 'BOSCH-101',
              name: 'Má phanh Bosch Premium',
              description: 'desc-1',
              price: 1750000,
              stockQuantity: 12,
              imageUrl: null,
              categoryId: 7,
              categoryName: 'Phanh',
            },
            {
              id: 202,
              sku: 'AKE-202',
              name: 'Má phanh Akebono',
              description: 'desc-2',
              price: 1690000,
              stockQuantity: 8,
              imageUrl: null,
              categoryId: 7,
              categoryName: 'Phanh',
            },
          ],
          comparableFields: ['name', 'price', 'stockQuantity', 'categoryName'],
          comparisonRows: {
            name: ['Má phanh Bosch Premium', 'Má phanh Akebono'],
            price: ['1750000', '1690000'],
            stockQuantity: ['12', '8'],
            categoryName: ['Phanh', 'Phanh'],
          },
        }),
      ),
    );

    renderWithProviders(
      <Routes>
        <Route path="/compare" element={<ComparePage />} />
      </Routes>,
      { route: '/compare' },
    );

    expect(await screen.findByRole('heading', { name: /so sánh sản phẩm/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /má phanh bosch premium/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /má phanh akebono/i })).toBeInTheDocument();
  });
});
