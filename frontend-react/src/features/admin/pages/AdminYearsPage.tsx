import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminModel, AdminModelYear, AdminModelYearPayload } from '../types';

export function AdminYearsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AdminModelYear | null>(null);
  const [formData, setFormData] = useState<AdminModelYearPayload>({ yearNumber: new Date().getFullYear(), modelId: 0 });

  const yearsQuery = useQuery<AdminModelYear[]>({ 
    queryKey: ['admin', 'years'], 
    queryFn: adminApi.getModelYears 
  });

  const modelsQuery = useQuery<AdminModel[]>({ 
    queryKey: ['admin', 'models'], 
    queryFn: adminApi.getModels 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createModelYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'years'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminModelYearPayload }) => 
      adminApi.updateModelYear(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'years'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteModelYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'years'] });
    },
  });

  const handleOpenModal = (year?: AdminModelYear) => {
    if (year) {
      setEditingYear(year);
      setFormData({ yearNumber: year.yearNumber, modelId: year.modelId });
    } else {
      setEditingYear(null);
      setFormData({ yearNumber: new Date().getFullYear(), modelId: modelsQuery.data?.[0]?.id || 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingYear(null);
    setFormData({ yearNumber: new Date().getFullYear(), modelId: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingYear) {
      updateMutation.mutate({ id: editingYear.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đời xe này?')) {
      deleteMutation.mutate(id);
    }
  };

  if (yearsQuery.isPending || modelsQuery.isPending) {
    return <LoadingState message="Đang tải dữ liệu..." />;
  }

  if (yearsQuery.isError) {
    return <ErrorState message="Không thể tải đời xe." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý đời xe</h1>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Thêm đời xe
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <AdminTable caption="Danh sách đời xe" headers={['ID', 'Năm sản xuất', 'Dòng xe', 'Thao tác']}>
          {(yearsQuery.data ?? []).map((year) => (
            <tr key={year.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500">{year.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{year.yearNumber}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{year.modelName || `Model ID: ${year.modelId}`}</td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => handleOpenModal(year)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(year.id)}
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
              {editingYear ? 'Cập nhật đời xe' : 'Thêm đời xe mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Năm sản xuất</label>
                <input
                  type="number"
                  required
                  value={formData.yearNumber}
                  onChange={(e) => setFormData({ ...formData, yearNumber: Number(e.target.value) })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                  placeholder="Nhập năm (vd: 2024)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dòng xe</label>
                <select
                  value={formData.modelId}
                  onChange={(e) => setFormData({ ...formData, modelId: Number(e.target.value) })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                >
                  {modelsQuery.data?.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
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
                  {editingYear ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
