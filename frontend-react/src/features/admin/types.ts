export type AdminUser = {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  roles?: string[];
};

export type AdminOrderItem = {
  id: number;
  partId?: number;
  partName?: string;
  quantity: number;
  price: number;
};

export type AdminOrder = {
  id: number;
  username: string;
  totalPrice: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  items: AdminOrderItem[];
};

export type AdminBrand = {
  id: number;
  name: string;
  logoUrl?: string;
};

export type AdminModel = {
  id: number;
  name: string;
  brandId: number;
};

export type AdminModelYear = {
  id: number;
  yearNumber: number;
  modelId: number;
  modelName?: string;
};

export type AdminCategory = {
  id: number;
  name: string;
  description?: string;
};

export type AdminPart = {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName?: string;
};

export type AdminPartPayload = Omit<AdminPart, 'id' | 'categoryName'>;

export type AdminComboItem = {
  partId: number;
  partName?: string;
  quantity: number;
  sortOrder: number;
  imageUrl?: string | null;
  unitPrice?: number;
};

export type AdminCombo = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  discountType: string;
  discountValue: number;
  active: boolean;
  items: AdminComboItem[];
};

export type AdminComboPayload = Omit<AdminCombo, 'id'>;

export type AdminBrandPayload = Omit<AdminBrand, 'id'>;
export type AdminModelPayload = Omit<AdminModel, 'id'>;
export type AdminModelYearPayload = Omit<AdminModelYear, 'id' | 'modelName'>;
export type AdminCategoryPayload = Omit<AdminCategory, 'id'>;
