import { ReactNode } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { AccountLayout } from './layouts/AccountLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminRoute } from './guards/AdminRoute';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { selectIsAuthenticated, useAuthStore } from '../store/authStore';
import { HomePage } from '../features/catalog/pages/HomePage';
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { CartPage } from '../features/cart/pages/CartPage';
import { OrderHistoryPage } from '../features/orders/pages/OrderHistoryPage';
import { OrderLookupPage } from '../features/orders/pages/OrderLookupPage';
import { PaymentReturnPage } from '../features/orders/pages/PaymentReturnPage';
import { FavoritesPage } from '../features/favorites/pages/FavoritesPage';
import { ComparePage } from '../features/compare/pages/ComparePage';
import { MockPaymentPage } from '../features/orders/pages/MockPaymentPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminUsersPage } from '../features/admin/pages/AdminUsersPage';
import { AdminOrdersPage } from '../features/admin/pages/AdminOrdersPage';
import { AdminBrandsPage } from '../features/admin/pages/AdminBrandsPage';
import { AdminModelsPage } from '../features/admin/pages/AdminModelsPage';
import { AdminYearsPage } from '../features/admin/pages/AdminYearsPage';
import { AdminCategoriesPage } from '../features/admin/pages/AdminCategoriesPage';
import { AdminCombosPage } from '../features/admin/pages/AdminCombosPage';
import { AdminPartsPage } from '../features/admin/pages/AdminPartsPage';
import { AdminCompatibilityPage } from '../features/admin/pages/AdminCompatibilityPage';
import { AboutPage } from '../features/info/pages/AboutPage';
import { ContactPage } from '../features/info/pages/ContactPage';
import { CombosPage } from '../features/catalog/pages/CombosPage';

function PublicStandalonePage({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-soft">
      <span className="inline-flex rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
        React migration workspace
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </section>
  );
}

function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'products/:id',
          element: <ProductDetailPage />,
        },
        {
          path: 'about',
          element: <AboutPage />,
        },
        {
          path: 'contact',
          element: <ContactPage />,
        },
        {
          path: 'combos',
          element: <CombosPage />,
        },
        {
          path: 'compare',
          element: <ComparePage />,
        },
        {
          path: 'orders/lookup',
          element: <OrderLookupPage />,
        },
        {
          path: 'orders/payment-return',
          element: <PaymentReturnPage />,
        },
        {
          path: 'payment/mock',
          element: <MockPaymentPage />,
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/login',
          element: (
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          ),
        },
        {
          path: '/register',
          element: (
            <GuestOnlyRoute>
              <RegisterPage />
            </GuestOnlyRoute>
          ),
        },
        {
          path: '/verify-otp',
          element: (
            <GuestOnlyRoute>
              <VerifyOtpPage />
            </GuestOnlyRoute>
          ),
        },
      ],
    },
    {
      element: (
        <ProtectedRoute>
          <AccountLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/cart',
          element: <CartPage />,
        },
        {
          path: '/account/profile',
          element: <ProfilePage />,
        },
        {
          path: '/account/orders',
          element: <OrderHistoryPage />,
        },
        {
          path: '/account/favorites',
          element: <FavoritesPage />,
        },
      ],
    },
    {
      path: '/unauthorized',
      element: (
        <PublicStandalonePage>
          <UnauthorizedPage />
        </PublicStandalonePage>
      ),
    },
    {
      path: '/admin',
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboardPage />,
        },
        {
          path: 'users',
          element: <AdminUsersPage />,
        },
        {
          path: 'orders',
          element: <AdminOrdersPage />,
        },
        {
          path: 'brands',
          element: <AdminBrandsPage />,
        },
        {
          path: 'models',
          element: <AdminModelsPage />,
        },
        {
          path: 'years',
          element: <AdminYearsPage />,
        },
        {
          path: 'categories',
          element: <AdminCategoriesPage />,
        },
        {
          path: 'parts',
          element: <AdminPartsPage />,
        },
        {
          path: 'combos',
          element: <AdminCombosPage />,
        },
        {
          path: 'compatibility',
          element: <AdminCompatibilityPage />,
        },
      ],
    },
    {
      path: '*',
      element: (
        <PublicStandalonePage>
          <NotFoundPage />
        </PublicStandalonePage>
      ),
    },
  ]);
}
