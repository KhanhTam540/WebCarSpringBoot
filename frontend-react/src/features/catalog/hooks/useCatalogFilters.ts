import { useMemo, useState } from 'react';
import type { CatalogFilters } from '../types';

const initialFilters: CatalogFilters = {
  keyword: '',
  brandId: '',
  modelId: '',
  modelYearId: '',
  categoryId: '',
};

export function useCatalogFilters() {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] = useState<CatalogFilters>(initialFilters);

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams();

    if (submittedFilters.keyword) params.set('keyword', submittedFilters.keyword);
    if (submittedFilters.brandId) params.set('brandId', submittedFilters.brandId);
    if (submittedFilters.modelId) params.set('modelId', submittedFilters.modelId);
    if (submittedFilters.modelYearId) params.set('modelYearId', submittedFilters.modelYearId);
    if (submittedFilters.categoryId) params.set('categoryId', submittedFilters.categoryId);

    const query = params.toString();
    return query ? `?${query}` : '';
  }, [submittedFilters]);

  return {
    filters,
    submittedFilters,
    searchQuery,
    setKeyword: (keyword: string) => setFilters((current) => ({ ...current, keyword })),
    setBrandId: (brandId: string) =>
      setFilters((current) => ({
        ...current,
        brandId,
        modelId: '',
        modelYearId: '',
      })),
    setModelId: (modelId: string) =>
      setFilters((current) => ({
        ...current,
        modelId,
        modelYearId: '',
      })),
    setModelYearId: (modelYearId: string) => setFilters((current) => ({ ...current, modelYearId })),
    setCategoryId: (categoryId: string) => setFilters((current) => ({ ...current, categoryId })),
    submit: () => setSubmittedFilters(filters),
  };
}
