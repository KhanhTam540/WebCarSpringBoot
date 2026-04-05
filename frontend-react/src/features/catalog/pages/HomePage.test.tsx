import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import { server } from '../../../test/server';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('loads filters and applies keyword, category, and model year search flow', async () => {
    server.use(
      http.get('/api/v1/brands', () =>
        HttpResponse.json([
          { id: 1, name: 'Toyota' },
          { id: 2, name: 'Honda' },
        ]),
      ),
      http.get('/api/v1/models/brand/1', () =>
        HttpResponse.json([
          { id: 10, name: 'Vios' },
          { id: 11, name: 'Corolla Altis' },
        ]),
      ),
      http.get('/api/v1/years/model/10', () =>
        HttpResponse.json([
          { id: 100, yearNumber: 2022 },
          { id: 101, yearNumber: 2023 },
        ]),
      ),
      http.get('/api/v1/categories', () =>
        HttpResponse.json([
          { id: 7, name: 'Phanh' },
          { id: 8, name: 'Lọc gió' },
        ]),
      ),
      http.get('/api/v1/parts/search', ({ request }) => {
        const url = new URL(request.url);

        if (
          url.searchParams.get('keyword') === 'bosch' &&
          url.searchParams.get('modelYearId') === '100' &&
          url.searchParams.get('categoryId') === '7'
        ) {
          return HttpResponse.json([
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
          ]);
        }

        return HttpResponse.json([]);
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/hãng xe/i)).toBeInTheDocument();
    });

    await screen.findByRole('option', { name: 'Toyota' });

    await user.selectOptions(screen.getByLabelText(/hãng xe/i), '1');
    await user.selectOptions(await screen.findByLabelText(/dòng xe/i), '10');
    await user.selectOptions(await screen.findByLabelText(/đời xe/i), '100');
    await user.selectOptions(screen.getByLabelText(/danh mục/i), '7');
    await user.type(screen.getByLabelText(/từ khóa/i), 'bosch');
    await user.click(screen.getByRole('button', { name: /filter phụ tùng/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /má phanh bosch premium/i })).toBeInTheDocument();
    });
  });

  it('uploads an image and renders suggested products from image search', async () => {
    server.use(
      http.get('/api/v1/brands', () => HttpResponse.json([])),
      http.get('/api/v1/categories', () => HttpResponse.json([])),
      http.get('/api/v1/parts/search', () => HttpResponse.json([])),
      http.post('/api/v1/search/image', () => {
        return HttpResponse.json({
          storedImageUrl: '/uploads/image-search/brake-pad.jpg',
          matchedTag: 'phanh',
          suggestions: [
            {
              id: 701,
              sku: 'BRAKE-701',
              name: 'Má phanh Akebono ProACT',
              price: 2150000,
              stockQuantity: 8,
              imageUrl: null,
              categoryId: 7,
              categoryName: 'Phanh',
            },
          ],
        });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    const fileInput = await screen.findByLabelText(/tải ảnh để gợi ý phụ tùng/i);
    const imageFile = new File(['fake-image'], 'brake-pad.jpg', { type: 'image/jpeg' });

    await user.upload(fileInput, imageFile);
    await user.click(screen.getByRole('button', { name: /tìm bằng hình ảnh/i }));

    await waitFor(() => {
      expect(screen.getByText(/đã nhận diện ảnh theo nhóm: phanh/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /má phanh akebono proact/i })).toBeInTheDocument();
    });
  });

  it('shows backend validation message when image upload is rejected', async () => {
    server.use(
      http.get('/api/v1/brands', () => HttpResponse.json([])),
      http.get('/api/v1/categories', () => HttpResponse.json([])),
      http.get('/api/v1/parts/search', () => HttpResponse.json([])),
      http.post('/api/v1/search/image', () =>
        HttpResponse.json(
          {
            status: 400,
            code: 'VALIDATION_ERROR',
            message: 'Định dạng tệp không được hỗ trợ',
            details: {},
          },
          { status: 400 },
        ),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    const fileInput = await screen.findByLabelText(/tải ảnh để gợi ý phụ tùng/i);
    const invalidFile = new File(['fake-image'], 'invalid-image.jpg', { type: 'image/jpeg' });

    await user.upload(fileInput, invalidFile);
    await user.click(screen.getByRole('button', { name: /tìm bằng hình ảnh/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/định dạng tệp không được hỗ trợ/i);
    });
  });
});
