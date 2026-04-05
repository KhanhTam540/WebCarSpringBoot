export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-br from-brand-50 via-white to-sky-50 p-10 shadow-lg sm:p-14">
      <div className="relative z-10 max-w-2xl">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 shadow-sm">
          Phụ Tùng Chính Hãng
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Tìm đúng phụ tùng cho <span className="text-brand-600">khung xe của bạn</span>
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
          WebOto cung cấp hệ thống phân loại linh kiện chi tiết theo hãng xe, dòng xe và đời xe. Trải nghiệm hệ thống tìm kiếm siêu tốc trên nền tảng React hiện đại.
        </p>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 z-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl filter"></div>
      <div className="absolute -bottom-32 left-1/2 z-0 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl filter"></div>
    </section>
  );
}
