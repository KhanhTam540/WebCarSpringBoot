import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../../../api/orderApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { OrderCard } from '../components/OrderCard';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import type { Order } from '../types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function OrderHistoryPage() {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ordersQuery = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders,
  });
  const orderDetailQuery = useQuery<Order>({
    queryKey: ['orders', expandedOrderId],
    queryFn: () => orderApi.getOrderById(expandedOrderId as number),
    enabled: expandedOrderId !== null,
  });

  if (ordersQuery.isPending) {
    return <LoadingState message="Đang tải lịch sử đơn hàng..." />;
  }

  if (ordersQuery.isError) {
    return <ErrorState message="Không thể tải lịch sử đơn hàng." />;
  }

  const orders = [...(ordersQuery.data ?? [])].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const ordersTestId = viewportWidth >= 1280 ? 'orders-desktop' : viewportWidth >= 768 ? 'orders-tablet' : 'orders-mobile';

  return (
    <section data-testid={ordersTestId} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Lịch sử đơn hàng</h1>
        <p className="text-sm text-slate-600">Theo dõi trạng thái đơn và xem chi tiết từng đơn hàng đã đặt.</p>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-600">
          Bạn chưa có đơn hàng nào.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={expandedOrderId === order.id}
              onViewDetails={setExpandedOrderId}
            />
          ))}
        </div>
      )}

      {expandedOrderId !== null ? (
        <section className="rounded-2xl border border-slate-200 bg-white/50 p-5">
          {orderDetailQuery.isPending ? <LoadingState message="Đang tải chi tiết đơn hàng..." /> : null}
          {orderDetailQuery.isError ? <ErrorState message="Không thể tải chi tiết đơn hàng." /> : null}

          {orderDetailQuery.data ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">Chi tiết đơn #{orderDetailQuery.data.id}</h2>
                <OrderStatusBadge status={orderDetailQuery.data.status} />
              </div>

              <dl className="grid gap-4 text-sm text-slate-800 md:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Địa chỉ giao hàng</dt>
                  <dd className="mt-1 text-slate-900">{orderDetailQuery.data.shippingAddress}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tổng giá trị</dt>
                  <dd className="mt-1 text-slate-900">{formatCurrency(orderDetailQuery.data.totalPrice)}</dd>
                </div>
              </dl>

              <div className="space-y-3">
                {orderDetailQuery.data.items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800">
                    <p className="font-medium text-slate-900">{item.partName}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Đơn giá: {formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
