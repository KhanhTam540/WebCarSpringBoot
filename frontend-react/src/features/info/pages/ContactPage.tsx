import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ phản hồi trong vòng 24 giờ tới.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Địa chỉ',
      value: 'Số 1, Đường Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh',
      color: 'bg-indigo-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Điện thoại',
      value: '+84 (028) 3896 8641',
      color: 'bg-emerald-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email hỗ trợ',
      value: 'support@weboto.com.vn',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-[#1a2332] tracking-tight">Kết Nối Với Chúng Tôi</h1>
        <p className="text-slate-500">
          Có bất kỳ câu hỏi nào về phụ tùng hoặc đơn hàng? 
          Đừng ngần ngại liên hệ, chúng tôi luôn ở đây để giúp bạn.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Contact Form Section */}
        <div className="lg:col-span-3">
          <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-soft">
            <h2 className="text-2xl font-black text-[#1a2332] mb-8">Gửi tin nhắn</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nguyễn Văn A" 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Địa chỉ Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@mail.com" 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="09xx xxx xxx" 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chủ đề</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Cần tư vấn phụ tùng..." 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung tin nhắn</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5} 
                  placeholder="Nhập nội dung bạn muốn gửi cho chúng tôi..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium resize-none"
                ></textarea>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-[#1a2332] text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                    </>
                ) : (
                    <>Gửi tin nhắn</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Cards Section */}
        <div className="lg:col-span-2 space-y-6">
          {contactInfo.map((info) => (
            <div key={info.label} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-soft group hover:border-blue-500/20 transition-all">
                <div className={`h-12 w-12 rounded-2xl ${info.color} flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {info.icon}
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{info.label}</h3>
                <p className="text-md font-bold text-[#1a2332] leading-snug">{info.value}</p>
            </div>
          ))}

          {/* Location / Social Card */}
          <div className="p-8 rounded-[2rem] bg-blue-600 text-white overflow-hidden relative shadow-2xl shadow-blue-500/20 group">
                <div className="absolute -top-12 -right-12 h-48 w-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-6">Mạng xã hội</h3>
                <div className="flex gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all cursor-pointer">
                            <div className="h-5 w-5 bg-current rounded-full"></div>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-xs font-bold text-white/70">
                    Theo dõi chúng tôi để cập nhật những ưu đãi mới nhất.
                </p>
          </div>
        </div>
      </div>
    </div>
  );
}
