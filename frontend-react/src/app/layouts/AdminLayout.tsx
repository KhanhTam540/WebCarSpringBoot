import { Outlet } from 'react-router-dom';
import { AppHeader } from '../../components/navigation/AppHeader';
import { AdminSidebar } from '../../features/admin/components/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <AppHeader />
      <div
        data-testid="admin-shell-desktop"
        className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]"
      >
        <AdminSidebar />

        <main className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
