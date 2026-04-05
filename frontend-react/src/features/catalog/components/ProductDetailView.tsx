import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cartApi';
import { favoriteApi } from '../../../api/favoriteApi';
import { Button } from '../../../components/common/Button';
import { useAuthStore, selectIsAuthenticated } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { useCompareStore } from '../../../store/compareStore';
import { ComboSection } from './ComboSection';
import { ProductReviews } from './ProductReviews';
import type { ComboSummary, PartDetail } from '../types';

export function ProductDetailView({ product, combos = [] }: { product: PartDetail; combos?: ComboSummary[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isOutOfStock = product.stockQuantity <= 0;
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const setBadgeCount = useCartStore((state) => state.setBadgeCount);
  const cartBadgeCount = useCartStore((state) => state.badgeCount);

  const partIds = useCompareStore((state) => state.partIds);
  const togglePart = useCompareStore((state) => state.togglePart);
  const isCompared = partIds.includes(product.id);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addItem({ partId: product.id, quantity: 1 }),
    onSuccess: () => {
      setBadgeCount(cartBadgeCount + 1);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: () => {
      alert('Không thể thêm vào giỏ hàng. Vui lòng đăng nhập hoặc thử lại sau.');
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: () => favoriteApi.addFavorite(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      alert('Đã thêm vào danh sách yêu thích!');
    },
    onError: () => {
      alert('Không thể thêm vào yêu thích. Vui lòng đăng nhập hoặc thử lại sau.');
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addFavoriteMutation.mutate();
  };

  const detailTestId = viewportWidth >= 1280 ? 'product-detail-desktop' : viewportWidth >= 768 ? 'product-detail-tablet' : 'product-detail-mobile';

  return (
    <div className="space-y-6">
      <section data-testid={detailTestId} className="grid w-full gap-8 rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-soft lg:grid-cols-[1.1fr_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-inner">
          <img
            src={product.imageUrl ?? 'https://placehold.co/960x640?text=WebOto+Detail'}
            alt={`Part ${product.name}`}
            className="h-full min-h-[320px] w-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>

        <div className="flex flex-col justify-between py-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-600">Thông tin chi tiết</p>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 pt-1">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">SKU: {product.sku}</span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600 uppercase tracking-wider">{product.categoryName ?? 'Phụ tùng'}</span>
              </div>
            </div>

            <div className="space-y-1">
               <p className="text-4xl font-black text-brand-600">{(product.price || 0).toLocaleString('vi-VN')} đ</p>
               <p className={`text-sm font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                {isOutOfStock ? '• TẠM HẾT HÀNG' : `• CÒN HÀNG (SỐ LƯỢNG: ${product.stockQuantity})`}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/40 p-5 text-sm leading-relaxed text-slate-600 shadow-sm italic">
              {product.description || 'Sản phẩm này hiện chưa cập nhật mô tả chi tiết. Vui lòng liên hệ hỗ trợ để biết thêm thông tin.'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
            <Button 
              type="button" 
              disabled={isOutOfStock || addToCartMutation.isPending}
              onClick={handleAddToCart}
              className="h-14 text-sm font-black tracking-widest uppercase shadow-lg shadow-indigo-200"
            >
              {addToCartMutation.isPending ? 'ĐANG XỬ LÝ...' : 'THÊM VÀO GIỎ HÀNG'}
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAddToFavorite}
                disabled={addFavoriteMutation.isPending}
                className="flex-1 h-14 text-xs font-bold uppercase"
              >
                YÊU THÍCH
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => togglePart(product.id)}
                className="flex-1 h-14 text-xs font-bold uppercase"
              >
                {isCompared ? 'BỎ SO SÁNH' : 'SO SÁNH'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-soft">
          <div className="mb-6 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-600">Độ tương thích</p>
            <h2 className="text-2xl font-black text-slate-900">Dòng xe hỗ trợ</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.compatibleVehicles.map((v, index) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{v.brandName}</p>
                  <p className="font-bold text-slate-900">{v.modelName} ({v.yearNumber})</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ComboSection combos={combos} />
      <ProductReviews partId={product.id} />
    </div>
  );
}
