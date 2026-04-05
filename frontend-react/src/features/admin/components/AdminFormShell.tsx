import { ReactNode } from 'react';

type AdminFormShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminFormShell({ title, description, children }: AdminFormShellProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/50 p-5">
      <div className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
