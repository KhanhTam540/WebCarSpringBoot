import { httpClient } from './httpClient';
import type { CartItem } from '../features/cart/types';

export const cartApi = {
  getCart: () => httpClient<CartItem[]>({ path: '/cart', method: 'GET' }),
  addItem: (payload: { partId: number; quantity: number }) =>
    httpClient<string>({ path: '/cart/items', method: 'POST', body: JSON.stringify(payload) }),
  updateItemQuantity: (itemId: number, quantity: number) =>
    httpClient<string>({ path: `/cart/items/${itemId}?quantity=${quantity}`, method: 'PUT' }),
  removeItem: (itemId: number) => httpClient<string>({ path: `/cart/items/${itemId}`, method: 'DELETE' }),
};
