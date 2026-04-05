import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { catalogApi } from '../../../api/catalogApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { Button } from '../../../components/common/Button';
import type { CatalogOption } from '../../catalog/types';

export function AdminCompatibilityPage() {
  const queryClient = useQueryClient();
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  
  // Xe đang chọn để thêm
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedYearId, setSelectedYearId] = useState('');

  // Queries
  const { data: parts = [], isLoading: isLoadingParts } = useQuery({ 
    queryKey: ['admin', 'parts'], 
    queryFn: adminApi.getParts 
  });

  const { data: partDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['part', selectedPartId],
    queryFn: () => catalogApi.getPartDetail(selectedPartId!),
    enabled: !!selectedPartId,
  });

  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: catalogApi.getBrands });
  const { data: models = [] } = useQuery({ 
    queryKey: ['models', selectedBrandId], 
    queryFn: () => catalogApi.getModels(Number(selectedBrandId)),
    enabled: !!selectedBrandId 
  });
  const { data: years = [] } = useQuery({ 
    queryKey: ['years', selectedModelId], 
    queryFn: () => catalogApi.getYears(Number(selectedModelId)),
    enabled: !!selectedModelId 
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: () => adminApi.setCompatibility(selectedPartId!, Number(selectedYearId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part', selectedPartId] });
      alert('Thêm tương thích thành công!');
    },
    onError: () => alert('Lỗi khi thêm tương thích.')
  });

  const deleteMutation = useMutation({
    mutationFn: (yearId: number) => adminApi.deleteCompatibility(selectedPartId!, yearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part', selectedPartId] });
      alert('Xóa tương thích thành công!');
    },
    onError: () => alert('Lỗi khi xóa tương thích.')
  });

  if (isLoadingParts) return <LoadingState message="Đang tải danh sách phụ tùng..." />;

  const handleAdd = () => {
    if (!selectedPartId || !selectedYearId) {
      alert('Vui lòng chọn đầy đủ phụ tùng và đời xe.');
      return;
    }
    addMutation.mutate();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Thiết lập tương thích</h1>
        <p className="text-slate-500 font-medium">Liên kết phụ tùng với các dòng xe hỗ trợ để tối ưu tìm kiếm.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Cột trái: Chọn phụ tùng */}
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-xs">1</span>
               Chọn phụ tùng
            </h3>
            <div className="relative">
              <select 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-brand-400 focus:ring-0 transition-all outline-none"
                value={selectedPartId || ''}
                onChange={(e) => setSelectedPartId(Number(e.target.value))}
              >
                <option value="">-- Chọn phụ tùng từ danh sách --</option>
                {parts.map(p => (
                  <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedPartId && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-500">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-xs">2</span>
                 Thêm xe tương thích
              </h3>
              
              <div className="space-y-3">
                <select 
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                  value={selectedBrandId}
                  onChange={(e) => { setSelectedBrandId(e.target.value); setSelectedModelId(''); setSelectedYearId(''); }}
                >
                  <option value="">-- Chọn hãng xe --</option>
                  {brands.map((b: CatalogOption) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>

                <select 
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm disabled:opacity-50"
                  value={selectedModelId}
                  disabled={!selectedBrandId}
                  onChange={(e) => { setSelectedModelId(e.target.value); setSelectedYearId(''); }}
                >
                  <option value="">-- Chọn dòng xe --</option>
                  {models.map((m: CatalogOption) => <option key={m.id} value={m.id}>{m.modelName}</option>)}
                </select>

                <select 
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm disabled:opacity-50"
                  value={selectedYearId}
                  disabled={!selectedModelId}
                  onChange={(e) => setSelectedYearId(e.target.value)}
                >
                  <option value="">-- Chọn năm sản xuất --</option>
                  {years.map((y: CatalogOption) => <option key={y.id} value={y.id}>{y.yearNumber}</option>)}
                </select>

                <Button 
                  className="w-full h-12 mt-2" 
                  onClick={handleAdd}
                  disabled={!selectedYearId || addMutation.isPending}
                >
                  {addMutation.isPending ? 'Đang thêm...' : 'Lưu liên kết'}
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* Cột phải: Danh sách hiện tại */}
        <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-soft flex flex-col min-h-[500px]">
          {!selectedPartId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                 <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-800">Chưa chọn phụ tùng</p>
                <p className="text-slate-500 max-w-xs">Chọn một phụ tùng từ danh sách bên trái để quản lý các dòng xe tương thích.</p>
              </div>
            </div>
          ) : isLoadingDetail ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingState message="Đang nạp dữ liệu tương thích..." />
            </div>
          ) : (
            <>
              <div className="bg-slate-50 border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Đang hiển thị cho</p>
                    <h2 className="text-xl font-black text-slate-900">{partDetail?.name}</h2>
                  </div>
                  <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600">
                    SKU: {partDetail?.sku}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Các dòng xe đã liên kết ({partDetail?.compatibleVehicles?.length || 0})</h3>
                
                {!partDetail?.compatibleVehicles?.length ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-slate-400 font-medium">Phụ tùng này chưa có dữ liệu tương thích.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partDetail?.compatibleVehicles.map((v, i) => (
                      <div key={i} className="group relative flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{v.brandName}</p>
                            <p className="font-bold text-slate-900">{v.modelName} ({v.yearNumber})</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Xóa liên kết với ${v.brandName} ${v.modelName} (${v.yearNumber})?`)) {
                              deleteMutation.mutate(v.modelYearId);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full border border-rose-100 bg-white text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
