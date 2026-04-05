import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '../../../api/catalogApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { FilterSidebar } from '../components/FilterSidebar';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { useCatalogFilters } from '../hooks/useCatalogFilters';
import type { CatalogOption, ImageSearchResponse, PartSummary } from '../types';

const ITEMS_PER_PAGE = 6;

export function HomePage() {
  const [imageSearchResult, setImageSearchResult] = useState<ImageSearchResponse | null>(null);
  const [imageSearchFile, setImageSearchFile] = useState<File | null>(null);
  const [imageSearchError, setImageSearchError] = useState<string | null>(null);
  const [isImageSearching, setIsImageSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    filters,
    searchQuery,
    setKeyword,
    setBrandId,
    setModelId,
    setModelYearId,
    setCategoryId,
    submit,
  } = useCatalogFilters();

  const brandsQuery = useQuery<CatalogOption[]>({ queryKey: ['brands'], queryFn: catalogApi.getBrands });
  const modelsQuery = useQuery<CatalogOption[]>({
    queryKey: ['models', filters.brandId],
    queryFn: () => catalogApi.getModels(Number(filters.brandId)),
    enabled: Boolean(filters.brandId),
  });
  const yearsQuery = useQuery<CatalogOption[]>({
    queryKey: ['years', filters.modelId],
    queryFn: () => catalogApi.getYears(Number(filters.modelId)),
    enabled: Boolean(filters.modelId),
  });
  const categoriesQuery = useQuery<CatalogOption[]>({ queryKey: ['categories'], queryFn: catalogApi.getCategories });
  
  const productsQuery = useQuery<PartSummary[]>({
    queryKey: ['parts', searchQuery],
    queryFn: () => catalogApi.searchParts(searchQuery),
  });

  const displayedProducts = useMemo(
    () => imageSearchResult?.suggestions ?? productsQuery.data ?? [],
    [imageSearchResult, productsQuery.data]
  );

  // Total pages calculation
  const totalPages = Math.ceil(displayedProducts.length / ITEMS_PER_PAGE);

  // Reset to first page when search changes or image result updates
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, imageSearchResult]);

  // Paginated products subset
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [displayedProducts, currentPage]);

  const handleImageSearch = async () => {
    if (!imageSearchFile) {
      setImageSearchError('Vui lòng chọn ảnh trước khi tìm kiếm.');
      return;
    }

    setIsImageSearching(true);
    setImageSearchError(null);

    try {
      const result = await catalogApi.searchByImage(imageSearchFile);
      setImageSearchResult(result);
    } catch (error) {
      setImageSearchResult(null);
      setImageSearchError(error instanceof Error ? error.message : 'Không thể phân tích ảnh lúc này.');
    } finally {
      setIsImageSearching(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <HeroSection />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <FilterSidebar
          filters={filters}
          brands={brandsQuery.data ?? []}
          models={modelsQuery.data ?? []}
          years={yearsQuery.data ?? []}
          categories={categoriesQuery.data ?? []}
          onKeywordChange={setKeyword}
          onBrandChange={setBrandId}
          onModelChange={setModelId}
          onYearChange={setModelYearId}
          onCategoryChange={setCategoryId}
          onSubmit={() => {
            submit();
            setImageSearchResult(null);
          }}
          imageSearchFile={imageSearchFile}
          isImageSearching={isImageSearching}
          imageSearchError={imageSearchError}
          onImageFileChange={(file) => {
            setImageSearchFile(file);
            setImageSearchResult(null);
            setImageSearchError(null);
          }}
          onImageSearch={handleImageSearch}
        />

        <section className="space-y-6">
          {imageSearchResult && (
            <div className="flex flex-col gap-4 rounded-3xl border border-brand-500/20 bg-brand-50/50 p-4 animate-in fade-in slide-in-from-top-4 duration-500 md:flex-row md:items-start">
               <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-md">
                 <img 
                   src={`http://localhost:8080${imageSearchResult.storedImageUrl}`} 
                   alt="Tìm kiếm bằng ảnh" 
                   className="h-full w-full object-cover"
                 />
                 <div className="absolute inset-0 bg-black/10" />
               </div>
               <div className="flex-1 space-y-2 py-1">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-brand-700">
                      {imageSearchResult.isAiResult ? (
                        <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      )}
                      <span className="text-sm font-black uppercase tracking-wider">
                        {imageSearchResult.isAiResult ? 'KẾT QUẢ AI CHÍNH XÁC' : 'TÌM KIẾM THEO TỪ KHÓA'}
                      </span>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                     {imageSearchResult.status === 'LOW_CONFIDENCE' && (
                       <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">ĐỘ TIN CẬY THẤP</span>
                     )}
                     <span className="text-[10px] font-medium text-slate-400">
                       Trạng thái: {imageSearchResult.aiStatus}
                     </span>
                   </div>
                 </div>
                 <p className="text-sm leading-relaxed text-slate-600">
                   {imageSearchResult.isAiResult 
                    ? `Hệ thống đã nhận diện ảnh thuộc nhóm: ${imageSearchResult.matchedTag?.toUpperCase() || 'PHỤ TÙNG'}. Dưới đây là các phụ tùng có độ tương đồng cao nhất.`
                    : imageSearchResult.status === 'AI_INITIALIZING'
                      ? 'AI đang được khởi tạo dữ liệu mô hình. Hệ thống đang tìm kiếm tạm thời theo tên tập tin...'
                      : `Không tìm thấy hình ảnh tương đồng trong kho dữ liệu. Hệ thống đang hiển thị gợi ý dựa trên từ khóa: "${imageSearchResult.matchedTag || 'không rõ'}".`}
                 </p>
               </div>
            </div>
          )}

          {!imageSearchResult && productsQuery.isLoading && <LoadingState message="Đang tải danh sách phụ tùng..." />}
          {!imageSearchResult && productsQuery.isError && <ErrorState message="Lỗi kết nối khi lọc dữ liệu! Vui lòng kiểm tra lại server." />}
          
          {displayedProducts.length > 0 ? (
            <div className="flex flex-col gap-8">
              <ProductGrid products={paginatedProducts} />
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 pb-12">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-xl border font-bold transition-all shadow-sm ${
                        currentPage === page
                          ? 'bg-indigo-600 border-indigo-600 text-white scale-110'
                          : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            !productsQuery.isLoading && !productsQuery.isError && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="rounded-full bg-slate-50 p-6 mb-4">
                   <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Không tìm thấy phụ tùng</h3>
                 <p className="text-slate-500 max-w-xs mx-auto">Vui lòng thử lại với từ khóa khác hoặc lọc theo hãng xe khác.</p>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}
