export function UnauthorizedPage() {
  return (
    <section className="w-full rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 text-slate-900">
      <h1 className="text-3xl font-bold">Không có quyền truy cập</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        Tài khoản hiện tại không có quyền truy cập khu vực quản trị. Hãy quay lại trang phù hợp hoặc đăng nhập bằng tài khoản quản trị.
      </p>
    </section>
  );
}
