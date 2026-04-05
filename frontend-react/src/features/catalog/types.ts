export type CatalogOption = {
  id: number;
  name?: string;
  modelName?: string;
  yearNumber?: number;
};

export type PartSummary = {
  id: number;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryId: number | null;
  categoryName?: string;
  similarityScore?: number | null;
};

export type VehicleCompatibility = {
  modelYearId: number;
  brandName: string;
  modelName: string;
  yearNumber: number;
};

export type PartDetail = PartSummary & {
  description: string | null;
  compatibleVehicles: VehicleCompatibility[];
};

export type ImageSearchResponse = {
  storedImageUrl: string;
  matchedTag: string | null;
  isAiResult: boolean;
  status: string;
  aiStatus: string;
  suggestions: PartSummary[];
};

export type ComboItemSummary = {
  partId: number;
  partName?: string;
  quantity: number;
  sortOrder: number;
  imageUrl?: string | null;
  unitPrice?: number;
};

export type ComboSummary = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  discountType: string;
  discountValue: number;
  active: boolean;
  items: ComboItemSummary[];
};

export type CatalogFilters = {
  keyword: string;
  brandId: string;
  modelId: string;
  modelYearId: string;
  categoryId: string;
};

export type ReviewDTO = {
  id: number;
  userId: number;
  userFullName: string;
  partId: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewRequest = {
  partId: number;
  rating: number;
  comment: string;
};
