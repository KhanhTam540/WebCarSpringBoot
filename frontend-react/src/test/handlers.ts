import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
  http.get('/api/v1/cart', () => {
    return HttpResponse.json([]);
  }),
  http.get('/api/v1/favorites', () => {
    return HttpResponse.json([]);
  }),
  http.post('/api/v1/favorites/:partId', ({ params }) => {
    return HttpResponse.json({
      id: 1,
      partId: Number(params.partId),
      sku: `FAVORITE-${params.partId}`,
      name: 'Sản phẩm yêu thích',
      price: 100000,
      stockQuantity: 5,
      imageUrl: null,
      categoryId: 1,
      categoryName: 'Phụ tùng',
    });
  }),
  http.delete('/api/v1/favorites/:partId', () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.get('/api/v1/compare', () => {
    return HttpResponse.json({
      parts: [],
      comparableFields: [],
      comparisonRows: {},
    });
  }),
  http.post('/api/v1/cart/items', () => {
    return HttpResponse.text('Đã thêm vào giỏ hàng');
  }),
  http.put('/api/v1/cart/items/:itemId', () => {
    return HttpResponse.text('Đã cập nhật giỏ hàng');
  }),
  http.delete('/api/v1/cart/items/:itemId', () => {
    return HttpResponse.text('Đã xóa khỏi giỏ hàng');
  }),
  http.get('/api/v1/orders', () => {
    return HttpResponse.json([]);
  }),
  http.get('/api/v1/orders/:orderId', () => {
    return HttpResponse.json({
      id: 0,
      username: 'guest',
      totalPrice: 0,
      status: 'PENDING',
      shippingAddress: '',
      paymentMethod: 'COD',
      createdAt: '2026-03-25T00:00:00',
      items: [],
    });
  }),
  http.post('/api/v1/orders', () => {
    return HttpResponse.json({
      id: 0,
      username: 'guest',
      totalPrice: 0,
      status: 'PENDING',
      shippingAddress: '',
      paymentMethod: 'COD',
      createdAt: '2026-03-25T00:00:00',
      items: [],
    });
  }),
];
