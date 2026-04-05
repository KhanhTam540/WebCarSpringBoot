import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminBrand, AdminModel, AdminModelPayload } from '../types';

export function AdminModelsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AdminModel | null>(null);
  const [formData, setFormData] = useState<AdminModelPayload>({ name: '', brandId: 0 });

  const modelsQuery = useQuery<AdminModel[]>({ 
    queryKey: ['admin', 'models'], 
    queryFn: adminApi.getModels 
  });

  const brandsQuery = useQuery<AdminBrand[]>({ 
    queryKey: ['admin', 'brands'], 
    queryFn: adminApi.getBrands 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'models'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminModelPayload }) => 
      adminApi.updateModel(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'models'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'models'] });
    },
  });

  const handleOpenModal = (model?: AdminModel) => {
    if (model) {
      setEditingModel(model);
      setFormData({ name: model.name, brandId: model.brandId });
    } else {
      setEditingModel(null);
      setFormData({ name: '', brandId: brandsQuery.data?.[0]?.id || 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModel(null);
    setFormData({ name: '', brandId: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModel) {
      updateMutation.mutate({ id: editingModel.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dòng xe này?')) {
      deleteMutation.mutate(id);
    }
  };

  if (modelsQuery.isPending || brandsQuery.isPending) {
    return <LoadingState message="Đang tải dữ liệu..." />;
  }

  if (modelsQuery.isError) {
    return <ErrorState message="Không thể tải dòng xe." />;
  }

  const brandsMap = brandsQuery.data?.reduce((acc, brand) => {
    acc[brand.id] = brand.name;
    return acc;
  }, {} as Record<number, string>) || {};

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý dòng xe</h1>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Thêm dòng xe
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <AdminTable caption="Danh sách dòng xe" headers={['ID', 'Tên dòng xe', 'Hãng xe', 'Thao tác']}>
          {(modelsQuery.data ?? []).map((model) => (
            <tr key={model.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-500">{model.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{model.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {brandsMap[model.brandId] || `Hãng ID: ${model.brandId}`}
              </td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => handleOpenModal(model)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(model.id)}
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
              {editingModel ? 'Cập nhật dòng xe' : 'Thêm dòng xe mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên dòng xe</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                  placeholder="Nhập tên dòng xe (vd: Camry, Civic...)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hãng xe</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                >
                  {brandsQuery.data?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
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
                  {editingModel ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
