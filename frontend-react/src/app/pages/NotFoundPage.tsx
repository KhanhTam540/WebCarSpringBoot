export function NotFoundPage() {
  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white/70 p-8 text-slate-900 shadow-soft">
      <h1 className="text-3xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        Đường dẫn bạn truy cập không tồn tại trong app shell mới. Hãy quay về trang chủ hoặc chọn một module hợp lệ.
      </p>
    </section>
  );
}
