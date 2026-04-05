import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { ImageSearchBox } from './ImageSearchBox';
import type { CatalogFilters, CatalogOption } from '../types';

type FilterSidebarProps = {
  filters: CatalogFilters;
  brands: CatalogOption[];
  models: CatalogOption[];
  years: CatalogOption[];
  categories: CatalogOption[];
  onKeywordChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
  imageSearchFile: File | null;
  isImageSearching: boolean;
  imageSearchError: string | null;
  onImageFileChange: (file: File | null) => void;
  onImageSearch: () => void;
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CatalogOption[];
  placeholder: string;
}) {
  const labelId = label.toLowerCase();

  return (
    <label className="block space-y-2 text-sm text-slate-800">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-brand-400 focus:outline-none"
        id={labelId}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={String(option.id)}>
            {option.name ?? option.modelName ?? option.yearNumber}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterSidebar({
  filters,
  brands,
  models,
  years,
  categories,
  onKeywordChange,
  onBrandChange,
  onModelChange,
  onYearChange,
  onCategoryChange,
  onSubmit,
  imageSearchFile,
  isImageSearching,
  imageSearchError,
  onImageFileChange,
  onImageSearch,
}: FilterSidebarProps) {
  return (
    <aside data-testid="filter-sidebar" className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-soft">
      <div className="space-y-5">
        <ImageSearchBox
          selectedFile={imageSearchFile}
          isSubmitting={isImageSearching}
          errorMessage={imageSearchError}
          onFileChange={onImageFileChange}
          onSubmit={onImageSearch}
        />

        <label className="block space-y-2 text-sm text-slate-800">
          <span>Từ khóa</span>
          <Input aria-label="Từ khóa" value={filters.keyword} onChange={(event) => onKeywordChange(event.target.value)} placeholder="Ví dụ: bosch, má phanh..." />
        </label>

        <SelectField label="Hãng xe" value={filters.brandId} onChange={onBrandChange} options={brands} placeholder="-- Chọn hãng xe --" />
        <SelectField label="Dòng xe" value={filters.modelId} onChange={onModelChange} options={models} placeholder="-- Chọn dòng xe --" />
        <SelectField label="Đời xe" value={filters.modelYearId} onChange={onYearChange} options={years} placeholder="-- Chọn đời xe --" />
        <SelectField label="Danh mục" value={filters.categoryId} onChange={onCategoryChange} options={categories} placeholder="-- Chọn danh mục --" />

        <Button type="button" className="w-full" onClick={onSubmit} aria-label="Filter phụ tùng">
          Tìm phụ tùng
        </Button>
      </div>
    </aside>
  );
}
