import { Link, useNavigate } from 'react-router-dom';
import { selectIsAdmin, selectIsAuthenticated, useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useCompareStore } from '../../store/compareStore';

export function AppHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const cartBadgeCount = useCartStore((state) => state.badgeCount);
  const compareBadgeCount = useCompareStore((state) => state.partIds.length);
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearCart = useCartStore((state) => state.clear);
  const clearCompare = useCompareStore((state) => state.clear);

  const handleLogout = () => {
    clearSession();
    clearCart();
    clearCompare();
    navigate('/');
  };

  const navLinks = [
    { 
      to: '/', 
      label: 'TRANG CHỦ', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    { 
      to: '/', 
      label: 'SẢN PHẨM', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    { 
      to: '/combos', 
      label: 'COMBO ƯU ĐÃI', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect x="2" y="7" width="20" height="5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      )
    },
    { 
      to: '/compare', 
      label: 'SO SÁNH', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    },
    // Admin Link
    ...(isAdmin ? [
      {
        to: '/admin',
        label: 'QUẢN TRỊ',
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        )
      }
    ] : []),
    { 
      to: '/orders/lookup', 
      label: 'TRA CỨU ĐƠN', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
      )
    },
    { 
      to: '/about', 
      label: 'GIỚI THIỆU', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    },
    { 
      to: '/contact', 
      label: 'LIÊN HỆ', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      )
    }
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a2332] text-white shadow-xl shadow-blue-900/20 overflow-hidden group">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter text-[#1a2332]">AUTOPARTS</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-blue-600">PREMIUM PARTS</span>
          </div>
        </Link>

        {/* Navigation Sidebar */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="group relative flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-black tracking-wider text-slate-500 hover:text-blue-600 transition-all"
            >
              <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                {link.icon}
              </div>
              <span>{link.label}</span>
              <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
              
              {link.label === 'SO SÁNH' && compareBadgeCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold animate-pulse">
                  {compareBadgeCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link to="/account/favorites" className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-rose-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
          )}

          <Link to="/cart" className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartBadgeCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg ring-2 ring-white">
                {cartBadgeCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
               <Link to="/account/profile" className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white pl-1.5 pr-4 transition-all hover:bg-slate-50 hover:shadow-md">
                 <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                 </div>
                 <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Hồ sơ</span>
               </Link>
               <button 
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-all shadow-sm"
                title="Đăng xuất"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <Link to="/login" className="px-4 py-2 text-sm text-slate-600 hover:text-blue-600 transition-colors uppercase">
                ĐĂNG NHẬP
              </Link>
              <Link to="/register" className="rounded-xl bg-[#1a2332] px-6 py-2.5 text-sm text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-blue-600/20 active:translate-y-0">
                ĐĂNG KÝ
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
