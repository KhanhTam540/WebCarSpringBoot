import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
      <div className="w-full max-w-xl md:max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <Outlet />
      </div>
    </main>
  );
}
