import { ReactNode } from 'react';

type AdminTableProps = {
  caption: string;
  headers: string[];
  children: ReactNode;
  testId?: string;
};

export function AdminTable({ caption, headers, children, testId }: AdminTableProps) {
  return (
    <div data-testid={testId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white/40">
      <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-white/80 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">{children}</tbody>
      </table>
    </div>
  );
}
