import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { comboApi } from '../../../api/comboApi';
import { cartApi } from '../../../api/cartApi';
import { favoriteApi } from '../../../api/favoriteApi';
import { useAuthStore, selectIsAuthenticated } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import type { ComboSummary } from '../types';

function formatDiscount(discountType: string, discountValue: number) {
  if (discountType === 'PERCENT') {
    return `Giảm ${discountValue}%`;
  }
  return `Giảm ${new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(discountValue)}`;
}

export function CombosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const setBadgeCount = useCartStore((state) => state.setBadgeCount);
  const cartBadgeCount = useCartStore((state) => state.badgeCount);

  const { data: combos, isLoading, isError } = useQuery({
    queryKey: ['combos', 'active'],
    queryFn: comboApi.getActiveCombos,
  });

  const addComboToCartMutation = useMutation({
    mutationFn: async (combo: ComboSummary) => {
      const promises = combo.items.map((item) =>
        cartApi.addItem({ partId: item.partId, quantity: item.quantity })
      );
      return Promise.all(promises);
    },
    onSuccess: (_, combo) => {
      const totalNewItems = combo.items.reduce((sum, item) => sum + item.quantity, 0);
      setBadgeCount(cartBadgeCount + totalNewItems);
      alert(`Đã thêm combo "${combo.name}" vào giỏ hàng!`);
    },
    onError: () => alert('Lỗi: Không thể thêm combo vào giỏ hàng.'),
  });

  const favoriteAllMutation = useMutation({
    mutationFn: async (combo: ComboSummary) => {
      const promises = combo.items.map((item) => favoriteApi.addFavorite(item.partId));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      alert('Đã thêm tất cả linh kiện trong combo vào danh sách yêu thích!');
    },
    onError: () => alert('Lỗi: Không thể thêm vào danh sách yêu thích.'),
  });

  const handleAction = (combo: ComboSummary, action: 'cart' | 'favorite') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (action === 'cart') addComboToCartMutation.mutate(combo);
    else favoriteAllMutation.mutate(combo);
  };

  if (isLoading) return <LoadingState message="Đang tìm kiếm các ưu đãi tốt nhất..." />;
  if (isError) return <ErrorState message="Lỗi khi tải danh sách combo." />;

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 py-16 px-8 text-center text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-indigo-700 opacity-90"></div>
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black uppercase tracking-tight">Combo Ưu Đãi Đặc Biệt</h1>
          <p className="text-brand-100 text-sm font-medium leading-relaxed">
            Tiết kiệm hơn với các bộ linh kiện được chuyên gia khuyên dùng. 
            Mua trọn bộ để nhận ưu đãi lên đến 25% giá trị sản phẩm.
          </p>
        </div>
      </section>

      {/* Grid List */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {combos?.map((combo) => (
          <article 
            key={combo.id} 
            className="group flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-3 shadow-soft-xl transition-all hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-slate-100">
              <img 
                src={combo.imageUrl || 'https://placehold.co/800x500?text=WebOto+Combo'} 
                alt={combo.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 rounded-full bg-rose-500 px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-lg">
                {formatDiscount(combo.discountType, combo.discountValue)}
              </div>
            </div>

            <div className="flex flex-col flex-1 p-5 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">{combo.name}</h2>
                <p className="text-xs text-slate-500 line-clamp-2 italic">"{combo.description}"</p>
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gồm {combo.items.length} thành phần:</p>
                <div className="space-y-2">
                  {combo.items.map((item) => (
                    <div key={item.partId} className="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                        <span className="line-clamp-1">{item.partName || `Phụ tùng #${item.partId}`}</span>
                      </div>
                      <span className="text-slate-400">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  disabled={addComboToCartMutation.isPending}
                  onClick={() => handleAction(combo, 'cart')}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1a2332] text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-brand-600 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                  {addComboToCartMutation.isPending && addComboToCartMutation.variables?.id === combo.id ? (
                      <span className="h-4 w-4 animate-spin border-2 border-white/20 border-t-white rounded-full"></span>
                  ) : (
                    <>Mua Ngay</>
                  )}
                </button>
                <button
                  disabled={favoriteAllMutation.isPending}
                  onClick={() => handleAction(combo, 'favorite')}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                   {favoriteAllMutation.isPending && favoriteAllMutation.variables?.id === combo.id ? (
                      <span className="h-4 w-4 animate-spin border-2 border-slate-400 border-t-rose-500 rounded-full"></span>
                  ) : (
                    <>Yêu Thích</>
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
