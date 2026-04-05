import { ChangeEvent, FormEvent } from 'react';
import { Button } from '../../../components/common/Button';

type ImageSearchBoxProps = {
  selectedFile: File | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
};

export function ImageSearchBox({ selectedFile, isSubmitting, errorMessage, onFileChange, onSubmit }: ImageSearchBoxProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Tìm phụ tùng bằng hình ảnh</h2>
        <p className="text-xs leading-6 text-slate-500">Tải ảnh phụ tùng để hệ thống gợi ý nhanh nhóm sản phẩm phù hợp.</p>
      </div>

      <label className="block space-y-2 text-sm text-slate-800">
        <span>Tải ảnh để gợi ý phụ tùng</span>
        <input
          aria-label="Tải ảnh để gợi ý phụ tùng"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-900 hover:border-brand-400"
        />
      </label>

      {selectedFile ? <p className="text-xs text-brand-200">Đã chọn ảnh: {selectedFile.name}</p> : null}
      {errorMessage ? <p role="alert" className="text-sm text-rose-300">{errorMessage}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting} aria-label="Tìm bằng hình ảnh">
        {isSubmitting ? 'Đang phân tích ảnh...' : 'Tìm bằng hình ảnh'}
      </Button>
    </form>
  );
}
