import { httpClient } from './httpClient';
import type { CreateOrderPayload } from '../features/cart/types';
import type { Order } from '../features/orders/types';

export const orderApi = {
  getOrders: () => httpClient<Order[]>({ path: '/orders', method: 'GET' }),
  getOrderById: (orderId: number) => httpClient<Order>({ path: `/orders/${orderId}`, method: 'GET' }),
  createOrder: (payload: CreateOrderPayload) =>
    httpClient<Order>({ path: '/orders', method: 'POST', body: JSON.stringify(payload) }),
  lookupOrder: (orderId: number) =>
    httpClient<Order>({ path: `/orders/lookup/${orderId}`, method: 'GET' }),
};
