import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/authApi';
import { profileApi } from '../../../api/profileApi';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useAuthStore } from '../../../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useMutation({
    mutationFn: async () => {
      const loginResult = await authApi.login({ username, password });
      useAuthStore.setState({ accessToken: loginResult.accessToken });

      const profile = await profileApi.getProfile();

      setSession({
        accessToken: loginResult.accessToken,
        user: {
          username: profile.username,
          roles: profile.roles,
        },
      });
    },
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      clearSession();
      setErrorMessage(error instanceof Error ? error.message : 'Không thể đăng nhập.');
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    loginMutation.mutate();
  }

  return (
    <section className="space-y-6" data-testid="auth-form">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Đăng nhập</h1>
        <p className="text-sm text-slate-600">Truy cập tài khoản để theo dõi đơn hàng và quản lý hồ sơ.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Tên đăng nhập</span>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Mật khẩu</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        {errorMessage ? (
          <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </p>
        ) : (
          <p role="status" className="sr-only">
            Sẵn sàng đăng nhập.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-brand-300 hover:text-brand-200">
          Đăng ký ngay
        </Link>
      </p>
    </section>
  );
}
