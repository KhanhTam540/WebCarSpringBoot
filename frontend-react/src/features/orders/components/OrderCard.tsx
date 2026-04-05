import { Button } from '../../../components/common/Button';
import type { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function OrderCard({
  order,
  onViewDetails,
  expanded,
}: {
  order: Order;
  onViewDetails: (orderId: number) => void;
  expanded: boolean;
}) {
  return (
    <article data-testid="order-card" className="rounded-2xl border border-slate-200 bg-white/50 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">Đơn hàng #{order.id}</h2>
          <p className="text-sm text-slate-600">Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          <p className="text-sm text-slate-600">Địa chỉ giao hàng: {order.shippingAddress}</p>
          <p className="text-sm font-medium text-slate-900">Tổng tiền: {formatCurrency(order.totalPrice)}</p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <OrderStatusBadge status={order.status} />
          <Button type="button" variant="secondary" onClick={() => onViewDetails(order.id)}>
            {expanded ? `Đang xem đơn #${order.id}` : `Xem chi tiết đơn #${order.id}`}
          </Button>
        </div>
      </div>
    </article>
  );
}
