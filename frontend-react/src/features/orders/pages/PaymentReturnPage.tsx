import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'checking' | 'failed'>('loading');

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const momo_ResultCode = searchParams.get('resultCode');
    const momo_OrderId = searchParams.get('orderId');

    if (vnp_ResponseCode && vnp_TxnRef) {
      if (vnp_ResponseCode === '00') {
        setStatus('checking');
        fetch(`/api/v1/payment/vnpay_return?${searchParams.toString()}`)
          .then(res => res.json())
          .then(data => setStatus(data.success ? 'success' : 'failed'))
          .catch(() => setStatus('failed'));
      } else {
        setStatus('failed');
      }
    } else if (momo_ResultCode && momo_OrderId) {
      if (momo_ResultCode === '0') {
        setStatus('checking');
        fetch(`/api/v1/payment/momo_return?${searchParams.toString()}`)
          .then(res => res.json())
          .then(data => setStatus(data.success ? 'success' : 'failed'))
          .catch(() => setStatus('failed'));
      } else {
        setStatus('failed');
      }
    } else {
      navigate('/account/orders');
    }
  }, [searchParams, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-3xl shadow-soft text-center">
      {status === 'loading' || status === 'checking' ? (
        <>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800">Đang xử lý thanh toán...</h2>
          <p className="text-slate-500 mt-2">Vui lòng không đóng cửa sổ này.</p>
        </>
      ) : status === 'success' ? (
        <>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-700">Thanh toán thành công!</h2>
          <p className="text-slate-600 mt-2 mb-8">Đơn hàng của bạn đã được thanh toán. Chúng tôi sẽ sớm xử lý giao hàng.</p>
          <Link to="/account/orders" className="inline-block bg-indigo-600 text-white font-bold rounded-xl px-8 py-3 hover:bg-indigo-700 transition">
            Xem đơn hàng của tôi
          </Link>
        </>
      ) : (
        <>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 mb-6">
             <svg className="h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-rose-700">Thanh toán thất bại</h2>
          <p className="text-slate-600 mt-2 mb-8">Giao dịch đã bị hủy hoặc có lỗi xảy ra. Đơn hàng của bạn vẫn được lưu lại, bạn có thể thanh toán lại sau.</p>
          <Link to="/account/orders" className="inline-block bg-slate-200 text-slate-800 font-bold rounded-xl px-8 py-3 hover:bg-slate-300 transition shrink">
            Trở lại danh sách đơn hàng
          </Link>
        </>
      )}
    </div>
  );
}
