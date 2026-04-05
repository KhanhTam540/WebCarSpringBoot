import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminOrder } from '../types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [searchId, setSearchId] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [statusValue, setStatusValue] = useState('PENDING');
  const [addressValue, setAddressValue] = useState('');

  const ordersQuery = useQuery<AdminOrder[]>({
    queryKey: ['admin', 'orders'],
    queryFn: adminApi.getOrders,
  });

  const displayedOrders = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    const keyword = searchId.trim();

    if (!keyword) return orders;
    return orders.filter((order) => String(order.id).includes(keyword));
  }, [ordersQuery.data, searchId]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) => 
      adminApi.updateOrderStatus(orderId, status),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ orderId, shippingAddress }: { orderId: number; shippingAddress: string }) =>
      adminApi.updateOrderAddress(orderId, shippingAddress),
  });

  if (ordersQuery.isPending) {
    return <LoadingState message="Đang tải đơn hàng..." />;
  }

  if (ordersQuery.isError) {
    return <ErrorState message="Không thể tải danh sách đơn hàng." />;
  }

  const handleOpenEditor = (order: AdminOrder) => {
    setEditingOrderId(order.id);
    setStatusValue(order.status);
    setAddressValue(order.shippingAddress);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (editingOrderId === null) return;

    try {
      await Promise.all([
        updateStatusMutation.mutateAsync({ orderId: editingOrderId, status: statusValue }),
        updateAddressMutation.mutateAsync({ orderId: editingOrderId, shippingAddress: addressValue }),
      ]);

      alert('Cập nhật đơn hàng thành công!');
      setEditingOrderId(null);
      await queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    } catch (error) {
      alert('Không thể cập nhật đơn hàng.');
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý đơn hàng</h1>
        <p className="text-slate-500">Theo dõi, kiểm tra và cập nhật trạng thái vận chuyển cho các đơn hàng của khách hàng.</p>
      </header>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium text-slate-700">Tìm kiếm theo mã đơn</label>
          <input 
            type="text"
            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
            placeholder="Nhập ID đơn hàng..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSearchId('')}
          className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors w-full md:w-auto"
        >
          Làm mới
        </button>
      </div>

      {editingOrderId !== null && (
        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-lg p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Cập nhật đơn hàng #{editingOrderId}</h2>
            <button onClick={() => setEditingOrderId(null)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trạng thái vận chuyển</label>
              <select
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Địa chỉ giao hàng</label>
              <input
                type="text"
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setEditingOrderId(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-md transition-all active:scale-95"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <AdminTable caption="Danh sách đơn hàng" headers={['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Hành động']}>
          {displayedOrders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-slate-900">#{order.id}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{order.username}</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(order.totalPrice)}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{order.paymentMethod}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleOpenEditor(order)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}
