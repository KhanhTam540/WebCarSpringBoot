import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminBrand, AdminBrandPayload } from '../types';

export function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<AdminBrand | null>(null);
  const [formData, setFormData] = useState<AdminBrandPayload>({ name: '', logoUrl: '' });

  const brandsQuery = useQuery<AdminBrand[]>({ 
    queryKey: ['admin', 'brands'], 
    queryFn: adminApi.getBrands 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminBrandPayload }) => 
      adminApi.updateBrand(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
    },
  });

  const handleOpenModal = (brand?: AdminBrand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name, logoUrl: brand.logoUrl || '' });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', logoUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({ name: '', logoUrl: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hãng xe này?')) {
      deleteMutation.mutate(id);
    }
  };

  if (brandsQuery.isPending) {
    return <LoadingState message="Đang tải hãng xe..." />;
  }

  if (brandsQuery.isError) {
    return <ErrorState message="Không thể tải hãng xe." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý hãng xe</h1>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Thêm hãng xe
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <AdminTable caption="Danh sách hãng xe" headers={['ID', 'Tên hãng', 'Logo URL', 'Thao tác']}>
          {(brandsQuery.data ?? []).map((brand) => (
            <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500">{brand.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{brand.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs" title={brand.logoUrl || ''}>
                {brand.logoUrl || '—'}
              </td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => handleOpenModal(brand)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingBrand ? 'Cập nhật hãng xe' : 'Thêm hãng xe mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên hãng xe</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                  placeholder="Nhập tên hãng (vd: Toyota, Honda...)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                  placeholder="Link ảnh logo"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {editingBrand ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
