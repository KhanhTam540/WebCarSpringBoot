import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { server } from '../../../test/server';
import { ProductDetailPage } from './ProductDetailPage';

describe('ProductDetailPage', () => {
  it('loads part detail from the route param instead of fetching the whole catalog', async () => {
    server.use(
      http.get('/api/v1/parts/55', () =>
        HttpResponse.json({
          id: 55,
          sku: 'DETAIL-55',
          name: 'Bộ lọc gió hiệu suất cao',
          description: 'Mô tả detail từ endpoint riêng',
          price: 990000,
          stockQuantity: 9,
          imageUrl: null,
          categoryId: 3,
          categoryName: 'Động cơ',
        }),
      ),
      http.get('/api/v1/combos/by-part/55', () =>
        HttpResponse.json([
          {
            id: 11,
            name: 'Combo bảo dưỡng động cơ',
            slug: 'combo-bao-duong-dong-co',
            description: 'Gợi ý mua kèm lọc gió và dầu động cơ.',
            imageUrl: null,
            discountType: 'PERCENT',
            discountValue: 10,
            active: true,
            items: [
              {
                partId: 55,
                partName: 'Bộ lọc gió hiệu suất cao',
                quantity: 1,
                sortOrder: 1,
              },
              {
                partId: 77,
                partName: 'Dầu động cơ tổng hợp',
                quantity: 2,
                sortOrder: 2,
              },
            ],
          },
        ]),
      ),
      http.get('/api/v1/parts/search', () => HttpResponse.json([], { status: 500 })),
    );

    renderWithProviders(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: '/products/55' },
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /bộ lọc gió hiệu suất cao/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/mô tả detail từ endpoint riêng/i)).toBeInTheDocument();
    expect(screen.getByText(/detail-55/i)).toBeInTheDocument();
    expect(screen.getByTestId('combo-section')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mua kèm tiết kiệm hơn/i })).toBeInTheDocument();
    expect(screen.getByText(/combo bảo dưỡng động cơ/i)).toBeInTheDocument();
    expect(screen.getByText(/dầu động cơ tổng hợp/i)).toBeInTheDocument();
  });

  it('keeps rendering product detail when combo suggestions fail', async () => {
    server.use(
      http.get('/api/v1/parts/88', () =>
        HttpResponse.json({
          id: 88,
          sku: 'DETAIL-88',
          name: 'Bugi đánh lửa iridium',
          description: 'Chi tiết bugi từ endpoint riêng',
          price: 420000,
          stockQuantity: 12,
          imageUrl: null,
          categoryId: 5,
          categoryName: 'Đánh lửa',
        }),
      ),
      http.get('/api/v1/combos/by-part/88', () => HttpResponse.json({ message: 'combo error' }, { status: 500 })),
    );

    renderWithProviders(
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>,
      { route: '/products/88' },
    );

    expect(await screen.findByRole('heading', { name: /bugi đánh lửa iridium/i })).toBeInTheDocument();
    expect(screen.getByText(/chi tiết bugi từ endpoint riêng/i)).toBeInTheDocument();
    expect(screen.queryByTestId('combo-section')).not.toBeInTheDocument();
  });
});
