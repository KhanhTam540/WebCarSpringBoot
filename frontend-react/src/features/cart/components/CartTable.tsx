import { Button } from '../../../components/common/Button';
import type { CartItem } from '../types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function CartTable({
  items,
  selectedItemIds,
  onToggleItem,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}: {
  items: CartItem[];
  selectedItemIds: number[];
  onToggleItem: (itemId: number) => void;
  onIncreaseQuantity: (item: CartItem) => void;
  onDecreaseQuantity: (item: CartItem) => void;
  onRemoveItem: (itemId: number) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white/50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <input
                id={`cart-item-${item.id}`}
                type="checkbox"
                className="mt-1 h-4 w-4 accent-brand-500"
                checked={selectedItemIds.includes(item.id)}
                onChange={() => onToggleItem(item.id)}
                aria-label={`Chọn ${item.partName}`}
              />

              <div className="space-y-2">
                <label htmlFor={`cart-item-${item.id}`} className="block text-lg font-semibold text-slate-900">
                  {item.partName}
                </label>
                <p className="text-sm text-slate-600">Đơn giá: {formatCurrency(item.price)}</p>
                <p className="text-sm text-slate-600">Thành tiền: {formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onDecreaseQuantity(item)}
                disabled={item.quantity <= 1}
                aria-label={`Giảm số lượng ${item.partName}`}
              >
                -
              </Button>
              <input
                readOnly
                value={String(item.quantity)}
                aria-label={`Số lượng ${item.partName}`}
                className="w-16 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-slate-900"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => onIncreaseQuantity(item)}
                aria-label={`Tăng số lượng ${item.partName}`}
              >
                +
              </Button>
              <Button type="button" variant="secondary" onClick={() => onRemoveItem(item.id)} aria-label={`Xóa ${item.partName}`}>
                Xóa
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
