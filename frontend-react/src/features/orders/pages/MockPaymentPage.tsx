import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, QrCode, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export function MockPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const method = searchParams.get('method'); // VNPAYQR, VNBANK, MOMO
  const bankCode = searchParams.get('bankCode');

  const bankData: Record<string, { name: string; logo: string; color: string; account: string }> = {
    VCB: { name: 'Vietcombank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-Vietcombank.png', color: 'bg-[#008000]', account: '1012345678' },
    BIDV: { name: 'BIDV', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-BIDV.png', color: 'bg-[#005BAA]', account: '12010000123456' },
    CTG: { name: 'VietinBank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VietinBank.png', color: 'bg-[#CE1126]', account: '10987654321' },
    TCB: { name: 'Techcombank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Techcombank.png', color: 'bg-[#E31837]', account: '19034567891011' },
    MB: { name: 'MBBank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-MB-Bank-New.png', color: 'bg-[#004A9C]', account: '0987654321' },
    ACB: { name: 'ACB', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-ACB.png', color: 'bg-[#007AC1]', account: '12345678' },
    STB: { name: 'Sacombank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Sacombank.png', color: 'bg-[#004A9C]', account: '060123456789' },
    VIB: { name: 'VIB', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VIB.png', color: 'bg-[#FF6B00]', account: '0123456789' },
  };

  const selectedBank = bankCode && bankData[bankCode] ? bankData[bankCode] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleConfirmPayment = () => {
    const baseUrl = '/orders/payment-return';
    let params = '';
    
    if (method === 'MOMO') {
      params = `?partnerCode=MOCK&orderId=${orderId}&resultCode=0&message=Success&signature=mock_sig&requestId=${Date.now()}`;
    } else {
      params = `?vnp_ResponseCode=00&vnp_TxnRef=MOCK_${orderId}&vnp_Amount=${Number(amount) * 100}&vnp_TransactionNo=12345678&vnp_SecureHash=mock_hash`;
    }
    
    navigate(baseUrl + params);
  };

  const isMomo = method === 'MOMO';
  const brandColor = isMomo ? 'bg-[#A50064]' : (selectedBank?.color || 'bg-[#005BAA]');
  const brandName = isMomo ? 'MoMo' : (selectedBank?.name || 'VNPay');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className={`${brandColor} p-8 text-white relative`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <QrCode size={120} />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-3xl shadow-lg mb-4 w-20 h-20 flex items-center justify-center">
              {isMomo ? (
                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-12 h-12 object-contain" />
              ) : selectedBank ? (
                <img src={selectedBank.logo} alt={selectedBank.name} className="w-16 h-16 object-contain" />
              ) : (
                <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-no-bg.png" alt="VNPay" className="w-12 h-12 object-contain" />
              )}
            </div>
            <h1 className="font-bold text-2xl">Thanh toán qua {brandName}</h1>
            <div className="mt-2 flex items-center gap-2 bg-black/10 px-4 py-1 rounded-full text-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Đang chờ giao dịch ... {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 flex flex-col items-center bg-white">
          <div className="mb-8 text-center w-full">
            <p className="text-slate-400 text-xs mb-1 uppercase tracking-[0.2em] font-bold">Số tiền giao dịch</p>
            <h2 className="text-5xl font-black text-slate-900 leading-tight">
              {Number(amount).toLocaleString('vi-VN')} <span className="text-2xl font-medium text-slate-400">₫</span>
            </h2>
          </div>

          {/* VietQR Styled QR Code */}
          <div className="relative mb-8 group cursor-pointer">
            <div className={`absolute -inset-2 ${brandColor} opacity-10 blur-xl rounded-full group-hover:opacity-20 transition duration-500`}></div>
            <div className="relative bg-white border-[12px] border-slate-50 flex flex-col items-center rounded-[3rem] shadow-sm p-4 overflow-hidden">
               {/* VietQR Header */}
               <div className="w-full flex justify-between items-center mb-4 px-2">
                 <img src="https://vietqr.net/portal-v2/images/img/vietqr-logo.png" alt="VietQR" className="h-6" />
                 <img src="https://napas.com.vn/vnt_upload/news/12_2022/napas_svg.svg" alt="Napas" className="h-4" />
               </div>

              <div className="relative w-64 h-64 bg-white rounded-2xl flex items-center justify-center p-2">
                {/* Generate a more realistic pattern */}
                <div className="grid grid-cols-25 grid-rows-25 w-full h-full gap-0.5 opacity-90">
                   {Array.from({ length: 625 }).map((_, i) => {
                     const isEdge = i < 25 || i > 600 || i % 25 === 0 || i % 25 === 24;
                     const isCenter = Math.abs(i - 312) < 50;
                     return (
                      <div key={i} className={`w-full h-full ${Math.random() > 0.4 || isEdge || isCenter ? (brandColor) : 'bg-transparent'} rounded-[0.5px]`}></div>
                     );
                   })}
                </div>
                
                {/* QR Center Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-xl shadow-md border-2 border-slate-50 w-16 h-16 flex items-center justify-center">
                     {isMomo ? (
                        <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-10 h-10 object-contain" />
                      ) : selectedBank ? (
                        <img src={selectedBank.logo} alt={selectedBank.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-no-bg.png" alt="VNPay" className="w-10 h-10 object-contain" />
                      )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quét mã bằng ứng dụng ngân hàng</p>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center">
                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Mã đơn hàng</p>
                 <span className="font-black text-slate-700">#{orderId}</span>
              </div>
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center">
                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Trạng thái</p>
                 <span className="font-black text-emerald-600 flex items-center gap-1">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                   Checking
                 </span>
              </div>
            </div>

            {selectedBank && (
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 shadow-inner">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium tracking-tight">Số tài khoản</span>
                    <span className="font-black text-slate-900 tabular-nums">{selectedBank.account}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium tracking-tight">Chủ tài khoản</span>
                    <span className="font-black text-slate-900 uppercase">CÔNG TY WEBOTO</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200/50">
                    <span className="text-slate-400 font-medium tracking-tight">Chi nhánh</span>
                    <span className="font-black text-slate-900">HCM - District 1</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleConfirmPayment}
              className={`w-full py-8 text-xl font-black rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${brandColor} text-white border-none`}
            >
              Tôi đã quét mã & thanh toán
            </Button>

            <button 
              onClick={() => navigate('/cart')}
              className="w-full flex items-center justify-center gap-3 text-slate-400 text-sm font-bold hover:text-slate-600 transition duration-300 group"
            >
              <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition">
                <ArrowLeft size={16} />
              </div>
              Quay lại giỏ hàng
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50/80 backdrop-blur-md p-6 border-t border-slate-100 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500">
           <div className="flex flex-col items-center">
             <ShieldCheck size={20} className="mb-1 text-slate-600" />
             <p className="text-[10px] uppercase font-bold tracking-tighter">PCI DSS</p>
           </div>
           <div className="h-8 w-px bg-slate-200"></div>
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
           <img src="https://vietqr.net/portal-v2/images/img/vietqr-logo.png" alt="VietQR" className="h-4" />
        </div>
      </div>
      
      <p className="mt-12 text-slate-400 text-[10px] text-center max-w-sm font-bold uppercase tracking-[0.3em] leading-relaxed">
         Môi trường mô phỏng thanh toán trực tuyến v2.5
      </p>
    </div>
  );
}
