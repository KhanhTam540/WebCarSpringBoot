import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminUser } from '../types';

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');

  const usersQuery = useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getUsers,
  });

  const searchUsersQuery = useQuery<AdminUser[]>({
    queryKey: ['admin', 'users', 'search', searchEmail],
    queryFn: () => adminApi.searchUsersByEmail(searchEmail.trim()),
    enabled: searchEmail.trim().length > 0,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: boolean }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'search'] });
      alert('Cập nhật trạng thái người dùng thành công!');
    },
  });

  const displayedUsers = useMemo(() => {
    if (searchEmail.trim()) {
      return searchUsersQuery.data ?? [];
    }
    return usersQuery.data ?? [];
  }, [searchEmail, searchUsersQuery.data, usersQuery.data]);

  if (usersQuery.isPending) {
    return <LoadingState message="Đang tải danh sách người dùng..." />;
  }

  if (usersQuery.isError) {
    return <ErrorState message="Không thể tải danh sách người dùng." />;
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý người dùng</h1>
        <p className="text-slate-500">Tìm kiếm khách hàng theo email và quản lý trạng thái hoạt động của tài khoản.</p>
      </header>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-sm font-medium text-slate-700">Tìm kiếm theo email</label>
          <input 
            type="text"
            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
            placeholder="Nhập email khách hàng..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setSearchEmail('')}
            className="flex-1 md:flex-none px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Làm mới
          </button>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })}
            className="flex-1 md:flex-none px-6 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <AdminTable caption="Danh sách người dùng" headers={['ID', 'Username', 'Email', 'Quyền', 'Trạng thái', 'Hành động']}>
          {displayedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500">#{user.id}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">{user.username}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex flex-wrap gap-1">
                  {(user.roles ?? ['ROLE_USER']).map(role => (
                    <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                      {role}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => toggleStatusMutation.mutate({ userId: user.id, status: !user.isActive })}
                  className={`font-medium transition-colors ${
                    user.isActive ? 'text-red-600 hover:text-red-900' : 'text-indigo-600 hover:text-indigo-900'
                  }`}
                >
                  {user.isActive ? 'Khóa' : 'Mở khóa'}
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}
