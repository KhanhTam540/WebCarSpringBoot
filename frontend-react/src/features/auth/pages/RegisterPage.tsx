import { FormEvent, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/authApi';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).{8,}$/;

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'alert' | 'status'; message: string } | null>(null);

  const isPasswordStrong = useMemo(() => PASSWORD_PATTERN.test(password), [password]);

  const registerMutation = useMutation({
    mutationFn: () => authApi.register({ username, email, password }),
    onSuccess: () => {
      navigate(`/verify-otp?username=${encodeURIComponent(username)}`);
    },
    onError: (error) => {
      setFeedback({
        type: 'alert',
        message: error instanceof Error ? error.message : 'Đăng ký thất bại.',
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPasswordStrong) {
      setFeedback({
        type: 'alert',
        message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
      });
      return;
    }

    setFeedback(null);
    registerMutation.mutate();
  }

  return (
    <section className="space-y-6" data-testid="auth-form">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Đăng ký</h1>
        <p className="text-sm text-slate-600">Tạo tài khoản mới và xác thực OTP để bắt đầu mua sắm.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Tên đăng nhập</span>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Email</span>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Mật khẩu</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
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

        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-brand-300 hover:text-brand-200">
          Đăng nhập ngay
        </Link>
      </p>
    </section>
  );
}
