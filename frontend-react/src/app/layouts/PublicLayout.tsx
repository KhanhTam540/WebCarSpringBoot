import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { AppFooter } from '../../components/navigation/AppFooter';
import { AppHeader } from '../../components/navigation/AppHeader';

export function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-900">
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-144px)] w-full max-w-6xl px-6 py-10">
        {children ?? <Outlet />}
      </main>
      <AppFooter />
    </div>
  );
}
