import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { compareApi } from '../../../api/compareApi';
import { cartApi } from '../../../api/cartApi';
import { catalogApi } from '../../../api/catalogApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useCompareStore } from '../../../store/compareStore';
import { useCartStore } from '../../../store/cartStore';
import { selectIsAuthenticated, useAuthStore } from '../../../store/authStore';

export function ComparePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const partIds = useCompareStore((state) => state.partIds);
  const togglePart = useCompareStore((state) => state.togglePart);
  const setBadgeCount = useCartStore((state) => state.setBadgeCount);
  const cartBadgeCount = useCartStore((state) => state.badgeCount);

  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const compareQuery = useQuery({
    queryKey: ['compare', partIds],
    queryFn: () => compareApi.compareParts(partIds),
    enabled: partIds.length > 0,
  });

  const searchQueryResults = useQuery({
    queryKey: ['catalog', 'search', searchQuery],
    queryFn: () => catalogApi.searchParts(`?keyword=${searchQuery}`),
    enabled: searchQuery.length >= 2,
  });

  const addToCartMutation = useMutation({
    mutationFn: (partId: number) => cartApi.addItem({ partId, quantity: 1 }),
    onSuccess: () => {
      setBadgeCount(cartBadgeCount + 1);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: () => alert('Lỗi: Không thể thêm vào giỏ hàng.'),
  });

  const handleAddToCart = (partId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate(partId);
  };

  const isAllValuesSame = (values: string[]) => {
    if (values.length <= 1) return true;
    return values.every((v) => v === values[0]);
  };

  if (partIds.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-12 py-12">
        <div className="flex flex-col items-center text-center space-y-4">
           <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-brand-500/10 text-brand-600 shadow-inner">
             <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">So sánh sản phẩm</h1>
           <p className="max-w-md text-sm font-medium text-slate-500 leading-relaxed italic">
             Hãy tìm kiếm và chọn ít nhất 2 sản phẩm để bắt đầu đối chiếu các thông số kỹ thuật chi tiết.
           </p>
        </div>

        <div className="relative space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-2 shadow-soft-xl ring-4 ring-slate-50">
            <input 
              type="text" 
              placeholder="Nhập tên sản phẩm hoặc SKU để thêm vào..." 
              className="w-full border-none bg-transparent px-6 py-4 text-sm font-bold placeholder:font-medium placeholder:text-slate-400 focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQueryResults.data && searchQueryResults.data.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {searchQueryResults.data.map((part) => (
                <button 
                  key={part.id}
                  onClick={() => { togglePart(part.id); setSearchQuery(''); }}
                  className="group flex flex-col items-start gap-4 rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-500/30 hover:shadow-lg"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                     <img src={part.imageUrl || 'https://placehold.co/200x200?text=Part'} alt={part.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 line-clamp-1 uppercase tracking-tight">{part.name}</p>
                    <p className="text-[10px] font-bold text-brand-600">{(part.price || 0).toLocaleString('vi-VN')} đ</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (compareQuery.isPending) return <LoadingState message="Đang khởi tạo bảng so sánh thông minh..." />;
  if (compareQuery.isError || !compareQuery.data) return <ErrorState message="Lỗi khi tải dữ liệu so sánh." />;

  const { parts, comparableFields, comparisonRows } = compareQuery.data;
  const filteredFields = showOnlyDifferences 
    ? comparableFields.filter(f => !isAllValuesSame(comparisonRows[f] || []))
    : comparableFields;

  return (
    <div className="w-full space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-500/20">
               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Smart Benchmark</h1>
          </div>
          <p className="max-w-xl text-sm font-medium text-slate-500 leading-relaxed italic">
            Đối chiếu chi tiết {parts.length} sản phẩm đã chọn. Sử dụng các công cụ lọc để tập trung vào điểm khác biệt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Diff Toggle */}
           <button 
             onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
             className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
               showOnlyDifferences 
               ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
               : 'bg-white text-slate-600 border border-slate-200'
             }`}
           >
             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             {showOnlyDifferences ? 'Hiện tất cả' : 'Chỉ xem khác biệt'}
           </button>
           <button 
             onClick={() => navigate('/')}
             className="flex items-center gap-2 rounded-2xl bg-[#1a2332] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-brand-600"
           >
             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             Thêm sản phẩm
           </button>
        </div>
      </header>

      <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white/70 shadow-soft-2xl backdrop-blur-xl transition-all">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
              <tr>
                <th className="w-[200px] p-8 align-top">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase">Comparison Matrix</span>
                    <span className="text-[10px] font-bold text-slate-300">v.1.0</span>
                  </div>
                </th>
                {parts.map((part) => (
                  <th key={part.id} className="p-8 text-left border-l border-slate-50">
                    <div className="group space-y-6">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 ring-8 ring-slate-50/50 shadow-inner">
                        <img 
                          src={part.imageUrl || 'https://placehold.co/400x300?text=Auto+Part'} 
                          alt={part.name} 
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <button 
                          onClick={() => togglePart(part.id)}
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 text-slate-400 shadow-xl backdrop-blur-sm transition-all hover:bg-rose-500 hover:text-white"
                        >
                           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <Link to={`/products/${part.id}`} className="block h-12 text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                          {part.name}
                        </Link>
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-slate-900">{(part.price || 0).toLocaleString('vi-VN')} đ</p>
                          <div className={`text-[10px] font-bold uppercase tracking-widest ${part.stockQuantity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {part.stockQuantity > 0 ? '● In Stock' : '● Out of Stock'}
                          </div>
                        </div>
                        <button
                          disabled={addToCartMutation.isPending && addToCartMutation.variables === part.id}
                          onClick={() => handleAddToCart(part.id)}
                          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-brand-200 transition-all hover:bg-[#1a2332] hover:-translate-y-1"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {/* Internal Metadata */}
              <tr className="bg-slate-50/40">
                <td className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Đặc tính nền tảng</td>
                {parts.map(p => <td key={p.id} className="p-6 border-l border-slate-50"></td>)}
              </tr>
              <tr className="transition-colors hover:bg-slate-50/50">
                <td className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mã SKU</td>
                {parts.map(p => <td key={p.id} className="p-6 text-xs font-bold text-slate-700 border-l border-slate-50">{p.sku}</td>)}
              </tr>
              <tr className="transition-colors hover:bg-slate-50/50">
                <td className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Phân loại</td>
                {parts.map(p => <td key={p.id} className="p-6 text-xs font-bold text-slate-700 border-l border-slate-50">{p.categoryName || 'General'}</td>)}
              </tr>

              {/* Comparable Rows */}
              <tr className="bg-slate-50/40">
                 <td className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Thông số kỹ thuật</td>
                 {parts.map(p => <td key={p.id} className="p-6 border-l border-slate-50"></td>)}
              </tr>
              {filteredFields.map((field) => (
                <tr key={field} className="group transition-all hover:bg-brand-50/20">
                  <td className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-brand-600 transition-colors">
                    {field}
                  </td>
                  {(comparisonRows[field] ?? []).map((value, index) => {
                    const isDiff = !isAllValuesSame(comparisonRows[field]);
                    return (
                      <td key={`${field}-${index}`} className={`p-6 border-l border-slate-50 text-xs font-bold leading-relaxed transition-colors ${
                        isDiff ? 'text-slate-900 bg-brand-50/10' : 'text-slate-500 font-medium'
                      }`}>
                        {value || '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredFields.length === 0 && showOnlyDifferences && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center">
           <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p className="text-sm font-bold text-slate-900">Không có điểm khác biệt</p>
           <p className="text-xs text-slate-500 mt-2">Các sản phẩm này có thông số kỹ thuật hoàn toàn giống nhau.</p>
        </div>
      )}
    </div>
  );
}
