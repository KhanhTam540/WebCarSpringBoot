import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { profileApi } from '../../../api/profileApi';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { selectIsAdmin, useAuthStore } from '../../../store/authStore';
import { ChangeEmailForm } from '../components/ChangeEmailForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

export function ProfilePage() {
  const isAdmin = useAuthStore(selectIsAdmin);
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });

  if (profileQuery.isPending) {
    return <LoadingState message="Đang tải hồ sơ người dùng..." />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return <ErrorState message="Không thể tải hồ sơ người dùng." />;
  }

  const profile = profileQuery.data;
  const email = emailOverride ?? profile.email;

  return (
    <section data-testid="profile-page" className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6">
        <h1 className="text-3xl font-bold text-slate-900">Hồ sơ tài khoản</h1>
        <dl className="mt-4 grid gap-4 text-sm text-slate-800 md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Tên đăng nhập</dt>
            <dd className="mt-1 font-medium text-slate-900">{profile.username}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="mt-1 font-medium text-slate-900">{email}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link
            to={isAdmin ? '/admin/users' : '#'}
            aria-disabled={isAdmin ? undefined : 'true'}
            className={`inline-flex rounded-xl px-4 py-2 text-sm font-medium ${
              isAdmin ? 'bg-brand-500 text-slate-950' : 'cursor-not-allowed bg-slate-50 text-slate-500'
            }`}
          >
            Quản trị hệ thống
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChangeEmailForm currentEmail={email} onEmailUpdated={setEmailOverride} />
        <ChangePasswordForm />
      </div>
    </section>
  );
}
