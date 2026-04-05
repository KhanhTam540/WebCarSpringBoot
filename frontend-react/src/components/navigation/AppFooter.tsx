export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">WebOto Platform</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Trải nghiệm mua sắm phụ tùng ô tô chính hãng với giao diện đẳng cấp, tìm kiếm thông minh và quy trình thanh toán mượt mà.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Liên kết</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li><a href="#" className="transition-colors hover:text-brand-600">Về chúng tôi</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-600">Chính sách bảo mật</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-600">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Hỗ trợ</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li><a href="#" className="transition-colors hover:text-brand-600">Trợ giúp FAQ</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-600">Liên hệ hỗ trợ</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-600">Chính sách đổi trả</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} WebOto React Frontend. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
