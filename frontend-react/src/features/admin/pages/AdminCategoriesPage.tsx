import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminCategory, AdminCategoryPayload } from '../types';

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState<AdminCategoryPayload>({ name: '', description: '' });

  const categoriesQuery = useQuery<AdminCategory[]>({ 
    queryKey: ['admin', 'categories'], 
    queryFn: adminApi.getCategories 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminCategoryPayload }) => 
      adminApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });

  const handleOpenModal = (category?: AdminCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      deleteMutation.mutate(id);
    }
  };

  if (categoriesQuery.isPending) {
    return <LoadingState message="Đang tải danh mục..." />;
  }

  if (categoriesQuery.isError) {
    return <ErrorState message="Không thể tải danh mục." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý danh mục</h1>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <AdminTable caption="Danh sách danh mục" headers={['ID', 'Tên danh mục', 'Mô tả', 'Thao tác']}>
          {(categoriesQuery.data ?? []).map((category) => (
            <tr key={category.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500">{category.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{category.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={category.description || ''}>
                {category.description || '—'}
              </td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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
              {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                  placeholder="Nhập tên danh mục (vd: Lốp xe, Đèn pha...)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                  placeholder="Nhập mô tả danh mục"
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
                  {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
