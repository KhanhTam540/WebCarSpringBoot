import { NavLink } from 'react-router-dom';

const adminLinks = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/users', label: 'Người dùng' },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/brands', label: 'Hãng xe' },
  { to: '/admin/models', label: 'Dòng xe' },
  { to: '/admin/years', label: 'Đời xe' },
  { to: '/admin/categories', label: 'Danh mục' },
  { to: '/admin/parts', label: 'Phụ tùng' },
  { to: '/admin/combos', label: 'Combo' },
  { to: '/admin/compatibility', label: 'Tương thích' },
];

export function AdminSidebar() {
  return (
    <aside data-testid="admin-sidebar" className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Khu vực quản trị</h2>
      <nav className="space-y-2">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-brand-500/20 text-slate-900' : 'text-slate-800 hover:bg-slate-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
