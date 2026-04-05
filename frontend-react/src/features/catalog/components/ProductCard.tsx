import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cartApi';
import { favoriteApi } from '../../../api/favoriteApi';
import { Button } from '../../../components/common/Button';
import { useAuthStore, selectIsAuthenticated } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { useCompareStore } from '../../../store/compareStore';
import type { PartSummary } from '../types';

export function ProductCard({ product }: { product: PartSummary }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isOutOfStock = product.stockQuantity <= 0;
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const setBadgeCount = useCartStore((state) => state.setBadgeCount);
  const cartBadgeCount = useCartStore((state) => state.badgeCount);

  const partIds = useCompareStore((state) => state.partIds);
  const togglePart = useCompareStore((state) => state.togglePart);
  const isCompared = partIds.includes(product.id);

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addItem({ partId: product.id, quantity: 1 }),
    onSuccess: () => {
      setBadgeCount(cartBadgeCount + 1);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: () => {
      alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: () => favoriteApi.addFavorite(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      alert('Đã thêm vào danh sách yêu thích!');
    },
    onError: () => {
      alert('Không thể thêm vào yêu thích. Vui lòng thử lại sau.');
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addFavoriteMutation.mutate();
  };

  return (
    <article data-testid="product-card" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white/70 shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={product.imageUrl ?? 'https://placehold.co/640x400?text=WebOto+Parts'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.similarityScore && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-brand-600/90 px-3 py-1 text-[10px] font-black text-white shadow-lg backdrop-blur-sm animate-in zoom-in-50 duration-300">
            {Math.round(product.similarityScore * 100)}% GIỐNG ẢNH
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
           <p className="text-white text-xs font-medium">Xem chi tiết sản phẩm</p>
        </div>
      </Link>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">{product.categoryName ?? 'Phụ tùng'}</p>
            <Link to={`/products/${product.id}`}>
              <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors hover:text-brand-600">{product.name}</h3>
            </Link>
          </div>
          <button 
            onClick={handleAddToFavorite}
            disabled={addFavoriteMutation.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
            title="Thêm vào yêu thích"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-xl font-black text-brand-600">{(product.price || 0).toLocaleString('vi-VN')} đ</p>
          <p className={`text-[11px] font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isOutOfStock ? 'HẾT HÀNG' : `CÒN ${product.stockQuantity}`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            type="button" 
            variant="primary" 
            className="w-full text-xs font-bold py-2.5"
            disabled={isOutOfStock || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending ? 'Đang thêm...' : 'THÊM GIỎ'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            className="w-full text-xs font-bold py-2.5"
            onClick={(e) => {
              e.preventDefault();
              togglePart(product.id);
            }}
          >
            {isCompared ? 'BỎ SO SÁNH' : 'SO SÁNH'}
          </Button>
        </div>
      </div>
    </article>
  );
}
