import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminBrand, AdminCategory, AdminModel, AdminModelYear, AdminPart, AdminPartPayload } from '../types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

const EMPTY_FORM: AdminPartPayload = {
  name: '',
  sku: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  imageUrl: '',
  categoryId: 0,
};

export function AdminPartsPage() {
  const queryClient = useQueryClient();
  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const [formState, setFormState] = useState<AdminPartPayload>(EMPTY_FORM);
  const [compatibilityPartId, setCompatibilityPartId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [modelYearId, setModelYearId] = useState('');

  const partsQuery = useQuery<AdminPart[]>({ queryKey: ['admin', 'parts'], queryFn: adminApi.getParts });
  const categoriesQuery = useQuery<AdminCategory[]>({ queryKey: ['admin', 'categories'], queryFn: adminApi.getCategories });
  const brandsQuery = useQuery<AdminBrand[]>({ queryKey: ['admin', 'brands'], queryFn: adminApi.getBrands });
  const modelsQuery = useQuery<AdminModel[]>({ queryKey: ['admin', 'models'], queryFn: adminApi.getModels });
  const yearsQuery = useQuery<AdminModelYear[]>({ queryKey: ['admin', 'years'], queryFn: adminApi.getModelYears });

  const savePartMutation = useMutation({
    mutationFn: (payload: { partId: number | null; data: AdminPartPayload }) =>
      payload.partId === null ? adminApi.createPart(payload.data) : adminApi.updatePart(payload.partId, payload.data),
    onSuccess: () => {
      setEditingPartId(null);
      setFormState(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ['admin', 'parts'] });
      alert('Đã lưu phụ tùng thành công!');
    },
  });

  const deletePartMutation = useMutation({
    mutationFn: adminApi.deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'parts'] });
      alert('Đã xóa phụ tùng thành công!');
    },
  });

  const setCompatibilityMutation = useMutation({
    mutationFn: ({ partId, yearId }: { partId: number; yearId: number }) => adminApi.setCompatibility(partId, yearId),
    onSuccess: () => {
      alert('Thiết lập tương thích thành công!');
    },
  });

  const filteredModels = useMemo(
    () => (modelsQuery.data ?? []).filter((item) => (brandId ? String(item.brandId) === brandId : true)),
    [brandId, modelsQuery.data],
  );

  const filteredYears = useMemo(
    () => (yearsQuery.data ?? []).filter((item) => (modelId ? String(item.modelId) === modelId : true)),
    [modelId, yearsQuery.data],
  );

  if ([partsQuery, categoriesQuery, brandsQuery, modelsQuery, yearsQuery].some((query) => query.isPending)) {
    return <LoadingState message="Đang tải dữ liệu..." />;
  }

  if ([partsQuery, categoriesQuery, brandsQuery, modelsQuery, yearsQuery].some((query) => query.isError)) {
    return <ErrorState message="Không thể tải dữ liệu." />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    savePartMutation.mutate({ partId: editingPartId, data: formState });
  };

  const handleEdit = (part: AdminPart) => {
    setEditingPartId(part.id);
    setFormState({
      name: part.name,
      sku: part.sku,
      description: part.description,
      price: part.price,
      stockQuantity: part.stockQuantity,
      imageUrl: part.imageUrl,
      categoryId: part.categoryId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ tùng này?')) {
      deletePartMutation.mutate(id);
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý phụ tùng</h1>
        <p className="text-slate-500 max-w-2xl">
          Quản lý toàn diện kho phụ tùng, thông tin chi tiết và thiết lập tính tương thích giữa phụ tùng với các đời xe.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {editingPartId === null ? 'Thêm phụ tùng mới' : `Cập nhật phụ tùng #${editingPartId}`}
            </h2>
            <p className="text-sm text-slate-500">Nhập đầy đủ thông tin để lưu vào hệ thống</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Tên phụ tùng</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Mã SKU</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formState.sku}
                  onChange={(e) => setFormState({ ...formState, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Giá bán (VND)</label>
                <input
                  type="number"
                  required
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formState.price}
                  onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Số lượng tồn kho</label>
                <input
                  type="number"
                  required
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formState.stockQuantity}
                  onChange={(e) => setFormState({ ...formState, stockQuantity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">URL hình ảnh</label>
              <input
                type="text"
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={formState.imageUrl}
                onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Chọn danh mục</label>
              <select
                required
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={formState.categoryId}
                onChange={(e) => setFormState({ ...formState, categoryId: Number(e.target.value) })}
              >
                <option value="0">-- Chọn danh mục --</option>
                {categoriesQuery.data?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savePartMutation.isPending}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                {editingPartId === null ? 'Lưu phụ tùng' : 'Cập nhật phụ tùng'}
              </button>
              {editingPartId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPartId(null);
                    setFormState(EMPTY_FORM);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Compatibility Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Thiết lập tương thích</h2>
            <p className="text-sm text-slate-500">Liên kết phụ tùng với các dòng xe và đời xe cụ thể</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Chọn phụ tùng</label>
              <select
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={compatibilityPartId}
                onChange={(e) => setCompatibilityPartId(e.target.value)}
              >
                <option value="">-- Chọn phụ tùng --</option>
                {partsQuery.data?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Hãng xe</label>
                <select
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  value={brandId}
                  onChange={(e) => {
                    setBrandId(e.target.value);
                    setModelId('');
                    setModelYearId('');
                  }}
                >
                  <option value="">-- Chọn hãng --</option>
                  {brandsQuery.data?.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Dòng xe</label>
                <select
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  value={modelId}
                  onChange={(e) => {
                    setModelId(e.target.value);
                    setModelYearId('');
                  }}
                >
                  <option value="">-- Chọn dòng xe --</option>
                  {filteredModels.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Đời xe</label>
              <select
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                value={modelYearId}
                onChange={(e) => setModelYearId(e.target.value)}
              >
                <option value="">-- Chọn đời xe --</option>
                {filteredYears.map((y) => (
                  <option key={y.id} value={y.id}>{y.yearNumber}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={setCompatibilityMutation.isPending || !compatibilityPartId || !modelYearId}
              onClick={() => setCompatibilityMutation.mutate({ 
                partId: Number(compatibilityPartId), 
                yearId: Number(modelYearId) 
              })}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors pt-2"
            >
              Cập nhật tương thích
            </button>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <AdminTable caption="Danh sách phụ tùng" headers={['SKU', 'Tên phụ tùng', 'Giá', 'Kho', 'Danh mục', 'Hành động']}>
          {partsQuery.data?.map((part) => (
            <tr key={part.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono text-slate-500">{part.sku}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{part.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{formatCurrency(part.price)}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{part.stockQuantity}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{part.categoryName || '—'}</td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => handleEdit(part)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(part.id)}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}
