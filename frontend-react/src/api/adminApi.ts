import type {
  AdminBrand,
  AdminBrandPayload,
  AdminCategory,
  AdminCategoryPayload,
  AdminCombo,
  AdminComboPayload,
  AdminModel,
  AdminModelPayload,
  AdminModelYear,
  AdminModelYearPayload,
  AdminOrder,
  AdminPart,
  AdminPartPayload,
  AdminUser,
} from '../features/admin/types';
import { httpClient } from './httpClient';

export const adminApi = {
  getUsers: () => httpClient<AdminUser[]>({ path: '/admin/users', method: 'GET' }),
  searchUsersByEmail: (email: string) =>
    httpClient<AdminUser[]>({ path: `/admin/users/search?email=${encodeURIComponent(email)}`, method: 'GET' }),
  updateUserStatus: (userId: number, status: boolean) =>
    httpClient<string>({ path: `/admin/users/${userId}/status?status=${status}`, method: 'PUT' }),
  getOrders: () => httpClient<AdminOrder[]>({ path: '/admin/orders', method: 'GET' }),
  getOrderById: (orderId: number) => httpClient<AdminOrder>({ path: `/admin/orders/${orderId}`, method: 'GET' }),
  updateOrderStatus: (orderId: number, status: string) =>
    httpClient<string>({ path: `/admin/orders/${orderId}/status`, method: 'PATCH', body: JSON.stringify({ status }) }),
  updateOrderAddress: (orderId: number, shippingAddress: string) =>
    httpClient<string>({
      path: `/admin/orders/${orderId}/address`,
      method: 'PATCH',
      body: JSON.stringify({ shippingAddress }),
    }),
  getBrands: () => httpClient<AdminBrand[]>({ path: '/admin/brands', method: 'GET' }),
  createBrand: (payload: AdminBrandPayload) =>
    httpClient<AdminBrand>({ path: '/admin/brands', method: 'POST', body: JSON.stringify(payload) }),
  updateBrand: (brandId: number, payload: AdminBrandPayload) =>
    httpClient<AdminBrand>({ path: `/admin/brands/${brandId}`, method: 'PUT', body: JSON.stringify(payload) }),
  deleteBrand: (brandId: number) => httpClient<void>({ path: `/admin/brands/${brandId}`, method: 'DELETE' }),

  getModels: () => httpClient<AdminModel[]>({ path: '/admin/models', method: 'GET' }),
  createModel: (payload: AdminModelPayload) =>
    httpClient<AdminModel>({ path: '/admin/models', method: 'POST', body: JSON.stringify(payload) }),
  updateModel: (modelId: number, payload: AdminModelPayload) =>
    httpClient<AdminModel>({ path: `/admin/models/${modelId}`, method: 'PUT', body: JSON.stringify(payload) }),
  deleteModel: (modelId: number) => httpClient<void>({ path: `/admin/models/${modelId}`, method: 'DELETE' }),

  getModelYears: () => httpClient<AdminModelYear[]>({ path: '/admin/model-years', method: 'GET' }),
  createModelYear: (payload: AdminModelYearPayload) =>
    httpClient<AdminModelYear>({ path: '/admin/model-years', method: 'POST', body: JSON.stringify(payload) }),
  updateModelYear: (yearId: number, payload: AdminModelYearPayload) =>
    httpClient<AdminModelYear>({ path: `/admin/model-years/${yearId}`, method: 'PUT', body: JSON.stringify(payload) }),
  deleteModelYear: (yearId: number) => httpClient<void>({ path: `/admin/model-years/${yearId}`, method: 'DELETE' }),

  getCategories: () => httpClient<AdminCategory[]>({ path: '/admin/categories', method: 'GET' }),
  createCategory: (payload: AdminCategoryPayload) =>
    httpClient<AdminCategory>({ path: '/admin/categories', method: 'POST', body: JSON.stringify(payload) }),
  updateCategory: (categoryId: number, payload: AdminCategoryPayload) =>
    httpClient<AdminCategory>({ path: `/admin/categories/${categoryId}`, method: 'PUT', body: JSON.stringify(payload) }),
  deleteCategory: (categoryId: number) => httpClient<void>({ path: `/admin/categories/${categoryId}`, method: 'DELETE' }),

  getParts: () => httpClient<AdminPart[]>({ path: '/admin/parts', method: 'GET' }),
  createPart: (payload: AdminPartPayload) =>
    httpClient<AdminPart>({ path: '/admin/parts', method: 'POST', body: JSON.stringify(payload) }),
  updatePart: (partId: number, payload: AdminPartPayload) =>
    httpClient<AdminPart>({ path: `/admin/parts/${partId}`, method: 'PUT', body: JSON.stringify(payload) }),
  deletePart: (partId: number) => httpClient<void>({ path: `/admin/parts/${partId}`, method: 'DELETE' }),

  getCombos: () => httpClient<AdminCombo[]>({ path: '/admin/combos', method: 'GET' }),
  createCombo: (payload: AdminComboPayload) =>
    httpClient<AdminCombo>({ path: '/admin/combos', method: 'POST', body: JSON.stringify(payload) }),
  updateCombo: (comboId: number, payload: AdminComboPayload) =>
    httpClient<AdminCombo>({ path: `/admin/combos/${comboId}`, method: 'PUT', body: JSON.stringify(payload) }),
  deleteCombo: (comboId: number) => httpClient<void>({ path: `/admin/combos/${comboId}`, method: 'DELETE' }),
  setComboActive: (comboId: number, active: boolean) =>
    httpClient<AdminCombo>({ path: `/admin/combos/${comboId}/active?active=${active}`, method: 'PATCH' }),

  setCompatibility: (partId: number, modelYearId: number) =>
    httpClient<string>({ path: `/admin/parts/${partId}/compatibility?modelYearId=${modelYearId}`, method: 'POST' }),
  deleteCompatibility: (partId: number, modelYearId: number) =>
    httpClient<string>({ path: `/admin/parts/${partId}/compatibility?modelYearId=${modelYearId}`, method: 'DELETE' }),

  getStatsSummary: () => httpClient<any>({ path: '/admin/statistics/summary', method: 'GET' }),
  getDailyRevenue: () => httpClient<any[]>({ path: '/admin/statistics/revenue/daily', method: 'GET' }),
  getMonthlyRevenue: () => httpClient<any[]>({ path: '/admin/statistics/revenue/monthly', method: 'GET' }),
};
