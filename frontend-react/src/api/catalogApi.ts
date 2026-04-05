import { httpClient } from './httpClient';
import type { CatalogOption, ImageSearchResponse, PartDetail, PartSummary, ReviewDTO, ReviewRequest } from '../features/catalog/types';

export const catalogApi = {
  getBrands: () => httpClient<CatalogOption[]>({ path: '/brands', method: 'GET' }),
  getModels: (brandId: number) => httpClient<CatalogOption[]>({ path: `/brands/${brandId}/models`, method: 'GET' }),
  getYears: (modelId: number) => httpClient<CatalogOption[]>({ path: `/models/${modelId}/years`, method: 'GET' }),
  getCategories: () => httpClient<CatalogOption[]>({ path: '/categories', method: 'GET' }),
  searchParts: (query = '') => httpClient<PartSummary[]>({ path: `/parts/search${query}`, method: 'GET' }),
  searchByImage: (image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    return httpClient<ImageSearchResponse>({
      path: '/search/image',
      method: 'POST',
      body: formData,
    });
  },
  getPartDetail: (partId: number) => httpClient<PartDetail>({ path: `/parts/${partId}`, method: 'GET' }),
  getPartReviews: (partId: number) => httpClient<ReviewDTO[]>({ path: `/reviews/part/${partId}`, method: 'GET' }),
  addPartReview: (data: ReviewRequest) => httpClient<ReviewDTO>({ path: `/reviews`, method: 'POST', body: JSON.stringify(data) }),
};
