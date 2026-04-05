import { Outlet } from 'react-router-dom';
import { AppFooter } from '../../components/navigation/AppFooter';
import { AppHeader } from '../../components/navigation/AppHeader';

export function AccountLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-144px)] w-full max-w-6xl px-6 py-10">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
