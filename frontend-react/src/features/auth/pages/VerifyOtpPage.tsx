import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../../api/authApi';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'alert' | 'status'; message: string } | null>(null);
  const username = searchParams.get('username') ?? '';

  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyOtp({ username, code }),
    onSuccess: (message) => {
      setFeedback({ type: 'status', message });
      navigate('/login');
    },
    onError: (error) => {
      setFeedback({
        type: 'alert',
        message: error instanceof Error ? error.message : 'Xác thực OTP thất bại.',
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    verifyMutation.mutate();
  }

  return (
    <section className="space-y-6" data-testid="auth-form">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Xác thực OTP</h1>
        <p className="text-sm text-slate-600">Nhập mã OTP đã được gửi tới email của bạn để kích hoạt tài khoản.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Mã OTP</span>
          <Input value={code} onChange={(event) => setCode(event.target.value)} />
        </label>

        {feedback ? (
          <p
            role={feedback.type}
            className={`rounded-xl px-4 py-3 text-sm ${
              feedback.type === 'alert'
                ? 'border border-rose-500/30 bg-rose-500/10 text-rose-200'
                : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={verifyMutation.isPending || !username}>
          {verifyMutation.isPending ? 'Đang xác nhận...' : 'Xác nhận'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-brand-300 hover:text-brand-200">
          Đăng nhập
        </Link>
      </p>
    </section>
  );
}
