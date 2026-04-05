import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Link } from 'react-router-dom';

function formatVND(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function AdminDashboardPage() {
  const statsQuery = useQuery({
    queryKey: ['admin-stats-summary'],
    queryFn: adminApi.getStatsSummary,
  });

  const dailyRevenueQuery = useQuery({
    queryKey: ['admin-stats-revenue-daily'],
    queryFn: adminApi.getDailyRevenue,
  });

  if (statsQuery.isPending || dailyRevenueQuery.isPending) {
    return <LoadingState message="Đang tải dữ liệu thống kê..." />;
  }

  if (statsQuery.isError) {
    return <ErrorState message="Không thể tải dữ liệu thống kê hệ thống." />;
  }

  const stats = statsQuery.data || { totalRevenue: 0, orderCount: 0, partCount: 0, userCount: 0, recentOrders: [] };
  const revenueData = dailyRevenueQuery.data || [];

  // Simple Bar Chart Calculation
  const maxRevenue = Math.max(...revenueData.map((d: any) => d.totalRevenue), 1);
  const chartData = revenueData.slice(-7); // Take last 7 days

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500">Chào mừng trở lại, đây là tình hình kinh doanh của WebOto hôm nay.</p>
        </div>
        <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cập nhật lần cuối</span>
            <p className="text-sm font-medium text-slate-900">{new Date().toLocaleString('vi-VN')}</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Tổng doanh thu" 
          value={formatVND(stats.totalRevenue)} 
          trend="+12.5%" 
          color="blue"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1H11.401M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <KpiCard 
          title="Đơn hàng" 
          value={stats.orderCount} 
          trend="+5" 
          color="emerald"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <KpiCard 
          title="Linh kiện" 
          value={stats.partCount} 
          trend="Mới" 
          color="indigo"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>}
        />
        <KpiCard 
          title="Khách hàng" 
          value={stats.userCount} 
          trend="Hoạt động" 
          color="rose"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Doanh thu 7 ngày gần đây</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               Tăng trưởng ổn định
            </div>
          </div>
          
          <div className="flex h-[240px] items-end justify-between gap-2 px-2">
            {chartData.map((item: any, idx: number) => {
              const height = (item.totalRevenue / maxRevenue) * 100;
              const dateStr = item.period || item.date || '0-0-0';
              const dateParts = dateStr.split('-');
              const displayDate = dateParts.length >= 3 ? `${dateParts[2]}/${dateParts[1]}` : dateStr;
              
              return (
                <div key={idx} className="group relative flex flex-1 flex-col items-center gap-2">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 font-bold">
                    {formatVND(item.totalRevenue)}
                  </div>
                  <div 
                    style={{ height: `${Math.max(height, 5)}%` }}
                    className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500 hover:from-blue-500 hover:to-blue-300"
                  />
                  <span className="text-[10px] font-bold text-slate-500">{displayDate}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Quick Links */}
        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl">
           <h2 className="text-lg font-bold">Lối tắt quản lý</h2>
           <p className="mt-1 text-xs text-slate-400">Các thao tác nhanh dành cho Admin</p>
           
           <div className="mt-6 flex flex-col gap-3">
              <QuickLink to="/admin/parts" label="Quản lý kho hàng" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
              <QuickLink to="/admin/orders" label="Duyệt đơn hàng mới" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
              <QuickLink to="/admin/users" label="Người dùng hệ thống" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
           </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">Giao dịch gần đây</h2>
          <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Ngày đặt</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(stats.recentOrders || []).map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4">{order.username}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{formatVND(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className={`rounded-2xl p-3 ${colorMap[color]}`}>{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{title}</p>
        <h3 className="mt-1 text-2xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );
}

function QuickLink({ to, label, icon }: any) {
    return (
        <Link to={to} className="flex items-center justify-between rounded-2xl bg-white/10 p-4 transition-all hover:bg-white hover:text-slate-900 group">
            <div className="flex items-center gap-3">
                <div className="text-blue-400 group-hover:text-blue-600">{icon}</div>
                <span className="text-sm font-bold">{label}</span>
            </div>
            <svg className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
    );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID': return 'bg-emerald-100 text-emerald-600';
    case 'PENDING': return 'bg-amber-100 text-amber-600';
    case 'SHIPPING': return 'bg-blue-100 text-blue-600';
    case 'CANCELLED': return 'bg-rose-100 text-rose-600';
    default: return 'bg-slate-100 text-slate-600';
  }
}
