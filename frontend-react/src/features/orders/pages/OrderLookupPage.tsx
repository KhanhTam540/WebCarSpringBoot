import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { orderApi } from '../../../api/orderApi';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import type { Order } from '../types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function OrderLookupPage() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [result, setResult] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lookupMutation = useMutation({
    mutationFn: (orderId: number) => orderApi.lookupOrder(orderId),
    onSuccess: (order) => {
      setResult(order);
      setErrorMessage(null);
    },
    onError: (error: Error) => {
      setResult(null);
      setErrorMessage(error.message);
    },
  });

  const handleLookup = () => {
    const orderId = Number(orderIdInput);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      setErrorMessage('Vui lòng nhập mã đơn hàng hợp lệ.');
      setResult(null);
      return;
    }

    lookupMutation.mutate(orderId);
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Tra cứu đơn hàng</h1>
        <p className="text-sm text-slate-600">Nhập mã đơn hàng để xem trạng thái và chi tiết giao hàng mới nhất.</p>
      </div>

      <div data-testid="order-lookup-form" className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/50 p-5 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="order-lookup-id" className="text-sm font-medium text-slate-900">
            Mã đơn hàng
          </label>
          <Input id="order-lookup-id" value={orderIdInput} onChange={(event) => setOrderIdInput(event.target.value)} />
        </div>

        <Button type="button" onClick={handleLookup} disabled={lookupMutation.isPending}>
          {lookupMutation.isPending ? 'Đang tra cứu...' : 'Tra cứu'}
        </Button>
      </div>

      {errorMessage ? <p role="alert" className="text-sm text-rose-300">{errorMessage}</p> : null}

      {result ? (
        <section data-testid="order-lookup-result" className="space-y-4 rounded-2xl border border-slate-200 bg-white/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Kết quả tra cứu đơn #{result.id}</h2>
            <div data-testid="order-status">
              <OrderStatusBadge status={result.status} />
            </div>
          </div>

          <dl className="grid gap-4 text-sm text-slate-800 md:grid-cols-2">
            <div>
              <dt className="text-slate-500">Địa chỉ giao hàng</dt>
              <dd data-testid="order-address" className="mt-1 text-slate-900">{result.shippingAddress}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tổng giá trị</dt>
              <dd data-testid="order-total" className="mt-1 text-slate-900">{formatCurrency(result.totalPrice)}</dd>
            </div>
          </dl>

          <div className="space-y-3">
            {result.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800">
                <p className="font-medium text-slate-900">{item.partName}</p>
                <p>Số lượng: {item.quantity}</p>
                <p>Đơn giá: {formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
