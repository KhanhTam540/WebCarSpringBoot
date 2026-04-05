import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { AdminTable } from '../components/AdminTable';
import type { AdminCombo, AdminComboItem, AdminComboPayload, AdminPart } from '../types';

const EMPTY_ITEM: AdminComboItem = {
  partId: 0,
  quantity: 1,
  sortOrder: 1,
};

const EMPTY_FORM: AdminComboPayload = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  discountType: 'PERCENT',
  discountValue: 0,
  active: true,
  items: [EMPTY_ITEM],
};

function formatDiscount(combo: AdminCombo) {
  if (combo.discountType === 'PERCENT') {
    return `${combo.discountValue}%`;
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(combo.discountValue);
}

function buildSlugFromName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function AdminCombosPage() {
  const queryClient = useQueryClient();
  const [editingComboId, setEditingComboId] = useState<number | null>(null);
  const [formState, setFormState] = useState<AdminComboPayload>(EMPTY_FORM);

  const combosQuery = useQuery<AdminCombo[]>({ queryKey: ['admin', 'combos'], queryFn: adminApi.getCombos });
  const partsQuery = useQuery<AdminPart[]>({ queryKey: ['admin', 'parts'], queryFn: adminApi.getParts });

  const saveComboMutation = useMutation({
    mutationFn: (payload: { comboId: number | null; data: AdminComboPayload }) =>
      payload.comboId === null ? adminApi.createCombo(payload.data) : adminApi.updateCombo(payload.comboId, payload.data),
    onSuccess: () => {
      setEditingComboId(null);
      setFormState(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
      alert('Đã lưu combo thành công!');
    },
  });

  const deleteComboMutation = useMutation({
    mutationFn: adminApi.deleteCombo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
      alert('Đã xóa combo thành công!');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ comboId, active }: { comboId: number; active: boolean }) => adminApi.setComboActive(comboId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] });
    },
  });

  const sortedParts = useMemo(() => {
    return [...(partsQuery.data ?? [])].sort((left, right) => left.name.localeCompare(right.name, 'vi'));
  }, [partsQuery.data]);

  if (combosQuery.isPending || partsQuery.isPending) {
    return <LoadingState message="Đang tải dữ liệu..." />;
  }

  if (combosQuery.isError || partsQuery.isError) {
    return <ErrorState message="Không thể tải dữ liệu." />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveComboMutation.mutate({ comboId: editingComboId, data: formState });
  };

  const handleEdit = (combo: AdminCombo) => {
    setEditingComboId(combo.id);
    setFormState({
      name: combo.name,
      slug: combo.slug,
      description: combo.description,
      imageUrl: combo.imageUrl,
      discountType: combo.discountType,
      discountValue: combo.discountValue,
      active: combo.active,
      items: combo.items.length > 0 ? combo.items.map((item) => ({ ...item })) : [EMPTY_ITEM],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa combo này?')) {
      deleteComboMutation.mutate(id);
    }
  };

  const handleItemChange = (index: number, patch: Partial<AdminComboItem>) => {
    setFormState((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () => {
    setFormState((current) => ({
      ...current,
      items: [...current.items, { ...EMPTY_ITEM, sortOrder: current.items.length + 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormState((current) => {
      const nextItems = current.items.filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        items: nextItems.length > 0 ? nextItems : [EMPTY_ITEM],
      };
    });
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Combo</h1>
        <p className="text-slate-500 max-w-2xl">
          Tạo các gói phụ tùng ưu đãi (Combo) để khuyến khích khách hàng mua sắm theo bộ.
        </p>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
        {/* Form Column */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                {editingComboId === null ? 'Tạo combo mới' : `Cập nhật combo #${editingComboId}`}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Tên combo</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500"
                  value={formState.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormState({ 
                      ...formState, 
                      name, 
                      slug: buildSlugFromName(name) 
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Slug</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500"
                  value={formState.slug}
                  onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">URL hình ảnh</label>
              <input
                type="text"
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500"
                value={formState.imageUrl}
                onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                rows={2}
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Kiểu giảm giá</label>
                <select
                  className="w-full rounded-lg border-slate-200"
                  value={formState.discountType}
                  onChange={(e) => setFormState({ ...formState, discountType: e.target.value })}
                >
                  <option value="PERCENT">Phần trăm (%)</option>
                  <option value="AMOUNT">Số tiền cố định (đ)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Giá trị giảm</label>
                <input
                  type="number"
                  required
                  className="w-full rounded-lg border-slate-200"
                  value={formState.discountValue}
                  onChange={(e) => setFormState({ ...formState, discountValue: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Danh sách phụ tùng thành phần</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  + Thêm phụ tùng
                </button>
              </div>

              {formState.items.map((item, index) => (
                <div key={index} className="grid gap-3 items-end md:grid-cols-[1fr_100px_80px_auto] p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Phụ tùng</label>
                    <select
                      className="w-full text-sm rounded-lg border-slate-200"
                      value={item.partId}
                      onChange={(e) => handleItemChange(index, { partId: Number(e.target.value) })}
                    >
                      <option value="0">Chọn...</option>
                      {sortedParts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Q.ty</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full text-sm rounded-lg border-slate-200"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, { quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Thứ tự</label>
                    <input
                      type="number"
                      className="w-full text-sm rounded-lg border-slate-200"
                      value={item.sortOrder}
                      onChange={(e) => handleItemChange(index, { sortOrder: Number(e.target.value) })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saveComboMutation.isPending}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
              >
                {editingComboId === null ? 'Lưu Combo' : 'Cập nhật Combo'}
              </button>
              {editingComboId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingComboId(null);
                    setFormState(EMPTY_FORM);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="font-bold text-indigo-900 mb-2">Ghi chú quan trọng</h3>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li>• Combo giúp tăng giá trị đơn hàng trung bình.</li>
              <li>• Bạn có thể tạm ẩn combo mà không cần xóa.</li>
              <li>• Tên combo nên ngắn gọn và hấp dẫn.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <AdminTable caption="Danh sách combo" headers={['Tên combo', 'Giảm giá', 'Trạng thái', 'Số phụ tùng', 'Hành động']}>
          {combosQuery.data?.map((combo) => (
            <tr key={combo.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{combo.name}</td>
              <td className="px-6 py-4 text-sm text-indigo-600 font-bold">{formatDiscount(combo)}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  combo.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {combo.active ? 'Đang bật' : 'Đã ẩn'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{combo.items.length} items</td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => handleEdit(combo)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Sửa
                </button>
                <button
                  onClick={() => toggleActiveMutation.mutate({ comboId: combo.id, active: !combo.active })}
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  {combo.active ? 'Ẩn' : 'Bật'}
                </button>
                <button
                  onClick={() => handleDelete(combo.id)}
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
