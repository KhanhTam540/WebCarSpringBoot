import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { cartApi } from '../../../api/cartApi';
import { useAuthStore, selectIsAuthenticated } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
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

export function ComboSection({ combos }: { combos: ComboSummary[] }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const setBadgeCount = useCartStore((state) => state.setBadgeCount);
  const cartBadgeCount = useCartStore((state) => state.badgeCount);

  const addComboMutation = useMutation({
    mutationFn: async (combo: ComboSummary) => {
      // Add each item in the combo to the cart
      const promises = combo.items.map((item) =>
        cartApi.addItem({ partId: item.partId, quantity: item.quantity })
      );
      return Promise.all(promises);
    },
    onSuccess: (_, combo) => {
      // Update badge count by adding all items' quantities
      const totalNewItems = combo.items.reduce((sum, item) => sum + item.quantity, 0);
      setBadgeCount(cartBadgeCount + totalNewItems);
      alert(`Đã thêm combo "${combo.name}" vào giỏ hàng!`);
    },
    onError: () => {
      alert('Không thể thêm combo vào giỏ hàng. Vui lòng thử lại sau.');
    },
  });

  const handleAddCombo = (combo: ComboSummary) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addComboMutation.mutate(combo);
  };

  if (combos.length === 0) {
    return null;
  }

  return (
    <section data-testid="combo-section" className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-white/80 to-slate-50/50 p-8 shadow-soft backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 ring-1 ring-inset ring-brand-500/20">
            Ưu đãi đặc biệt
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mua kèm tiết kiệm hơn</h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500 font-medium">
            Tận hưởng mức giá ưu đãi khi mua trọn bộ phụ tùng được các chuyên gia của chúng tôi đề xuất.
          </p>
        </div>
        <div className="hidden md:block">
            <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200"></div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white ring-2 ring-white">
                    +{combos.length}
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {combos.map((combo) => (
          <article 
            key={combo.id} 
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-2 shadow-sm transition-all hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{combo.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-600">{formatDiscount(combo.discountType, combo.discountValue)}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{combo.items.length} sản phẩm</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
              </div>

              {combo.description && (
                <p className="text-sm italic text-slate-500 line-clamp-2 leading-relaxed">
                  "{combo.description}"
                </p>
              )}

              <div className="space-y-2">
                {combo.items.map((item) => (
                  <div 
                    key={`${combo.id}-${item.partId}`} 
                    className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-2.5 transition-colors group-hover:bg-brand-50/30"
                  >
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-brand-500 shadow-sm shadow-brand-500/40"></div>
                        <span className="text-xs font-bold text-slate-700">{item.partName ?? `Phụ tùng #${item.partId}`}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={addComboMutation.isPending}
                onClick={() => handleAddCombo(combo)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a2332] py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-brand-600 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {addComboMutation.isPending && addComboMutation.variables?.id === combo.id ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang thêm...
                  </>
                ) : (
                  <>Thêm combo vào giỏ</>
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
