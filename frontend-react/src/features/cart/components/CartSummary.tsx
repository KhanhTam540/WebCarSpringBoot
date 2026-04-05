import { Button } from '../../../components/common/Button';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function CartSummary({
  totalPrice,
  shippingAddress,
  onShippingAddressChange,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
  isSubmitting,
  selectedBank,
  onBankChange,
}: {
  totalPrice: number;
  shippingAddress: string;
  onShippingAddressChange: (value: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  onCheckout: () => void;
  isSubmitting: boolean;
  selectedBank: string;
  onBankChange: (value: string) => void;
}) {
  const banks = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'CTG', name: 'VietinBank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'MB', name: 'MBBank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'STB', name: 'Sacombank' },
    { code: 'VIB', name: 'VIB' },
  ];

  return (
    <aside data-testid="cart-summary" className="space-y-4 rounded-2xl border border-slate-200 bg-white/50 p-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Tổng thanh toán</h2>
        <p className="mt-2 text-2xl font-bold text-brand-100">{formatCurrency(totalPrice)}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="shipping-address" className="text-sm font-medium text-slate-900">
          Địa chỉ giao hàng
        </label>
        <textarea
          id="shipping-address"
          value={shippingAddress}
          onChange={(event) => onShippingAddressChange(event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
          placeholder="Nhập địa chỉ nhận hàng"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-900">Phương thức thanh toán</legend>
        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="radio"
            name="payment-method"
            value="COD"
            checked={paymentMethod === 'COD'}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
          />
          Thanh toán khi nhận hàng
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="radio"
            name="payment-method"
            value="VNPAYQR"
            checked={paymentMethod === 'VNPAYQR'}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
          />
          Thanh toán qua ứng dụng VNPay (Quét mã QR)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="radio"
            name="payment-method"
            value="VNBANK"
            checked={paymentMethod === 'VNBANK'}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
          />
          Thanh toán qua Thẻ / Tài khoản Ngân hàng
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-800">
          <input
            type="radio"
            name="payment-method"
            value="MOMO"
            checked={paymentMethod === 'MOMO'}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
          />
          Thanh toán qua momo
        </label>

        {paymentMethod === 'VNBANK' && (
          <div className="mt-2 ml-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="bank-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Chọn ngân hàng
            </label>
            <select
              id="bank-select"
              value={selectedBank}
              onChange={(e) => onBankChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none shadow-sm"
            >
              <option value="">-- Chọn ngân hàng --</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </fieldset>

      <Button type="button" onClick={onCheckout} disabled={isSubmitting} className="w-full justify-center">
        {isSubmitting ? 'Đang tạo đơn...' : 'Đặt hàng đã chọn'}
      </Button>
    </aside>
  );
}
