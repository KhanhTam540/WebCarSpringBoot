import { Link } from 'react-router-dom';

export function AboutPage() {
  const stats = [
    { label: 'Năm kinh nghiệm', value: '15+' },
    { label: 'Phụ tùng chính hãng', value: '10,000+' },
    { label: 'Khách hàng tin tưởng', value: '5,000+' },
    { label: 'Đại lý trên toàn quốc', value: '50+' },
  ];

  return (
    <div className="w-full space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1a2332] py-20 px-8 text-center shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 overflow-hidden blur-3xl opacity-20">
          <div className="h-96 w-96 rounded-full bg-blue-500"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 ring-1 ring-inset ring-blue-500/20">
            Chào mừng đến với Nhom21_WebOto
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Nâng Tầm Trải Nghiệm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Phụ Tùng Ô Tô
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Chúng tôi là đối tác tin cậy cung cấp giải pháp phụ tùng ô tô toàn diện, 
            kết nối trực tiếp giữa chất lượng chính hãng và người tiêu dùng thông minh.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft text-center group hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-black text-[#1a2332] mb-1 group-hover:text-blue-600 transition-colors">
              {stat.value}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission & Story */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-[#1a2332] tracking-tight">Sứ mệnh của chúng tôi</h2>
          <p className="text-slate-600 leading-relaxed">
            Nhom21_WebOto được thành lập với tầm nhìn trở thành nền tảng thương mại điện tử phụ tùng ô tô 
            hàng đầu Việt Nam. Chúng tôi cam kết mang lại sự an tâm tuyệt đối cho khách hàng thông qua 
            quy trình kiểm định nghiêm ngặt và dịch vụ hỗ trợ chuyên nghiệp.
          </p>
          <div className="space-y-4">
            {[
              '100% Phụ tùng nhập khẩu chính ngạch',
              'Chính sách bảo hành dài hạn nhất thị trường',
              'Hỗ trợ kỹ thuật 24/7 từ chuyên gia',
              'Giao hàng hỏa tốc trong 2-4 giờ tại nội thành'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <div className="flex-none h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
             <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 select-none">
                    <svg className="w-64 h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </div>
                <div className="absolute bottom-12 left-12 right-12 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                    <p className="italic text-lg">"Chất lượng sản phẩm là danh dự, sự hài lòng của khách hàng là động lực."</p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/20"></div>
                        <div>
                            <p className="font-bold text-sm">Mr. CEO</p>
                            <p className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Founder of WebOto</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="p-12 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
            <h3 className="text-2xl font-black text-indigo-950">Bạn cần tư vấn kỹ thuật?</h3>
            <p className="text-indigo-700/70">Đội ngũ kỹ thuật viên giàu kinh nghiệm của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
        </div>
        <Link to="/contact" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            Liên hệ ngay hôm nay
        </Link>
      </section>
    </div>
  );
}
