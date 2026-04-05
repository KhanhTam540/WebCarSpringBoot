import { FormEvent, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../../../api/profileApi';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).{8,}$/;

export function ChangePasswordForm() {
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'alert' | 'status'; message: string } | null>(null);

  const isPasswordStrong = useMemo(() => PASSWORD_PATTERN.test(newPassword), [newPassword]);

  const sendOtpMutation = useMutation({
    mutationFn: () => profileApi.sendOtpForProfile(),
    onSuccess: (message) => {
      setFeedback({ type: 'status', message });
    },
    onError: (error) => {
      setFeedback({ type: 'alert', message: error instanceof Error ? error.message : 'Không thể gửi OTP.' });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => profileApi.verifyChangePassword({ otpCode, newPassword }),
    onSuccess: (message) => {
      setFeedback({ type: 'status', message });
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error) => {
      setFeedback({ type: 'alert', message: error instanceof Error ? error.message : 'Không thể đổi mật khẩu.' });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'alert', message: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    if (!isPasswordStrong) {
      setFeedback({ type: 'alert', message: 'Mật khẩu mới chưa đạt yêu cầu bảo mật.' });
      return;
    }

    setFeedback(null);
    submitMutation.mutate();
  }

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/60 p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Đổi mật khẩu</h2>
        <p className="text-sm text-slate-500">Xác thực bằng OTP trước khi đổi mật khẩu.</p>
      </div>

      <Button type="button" variant="secondary" onClick={() => sendOtpMutation.mutate()}>
        Gửi mã OTP đổi mật khẩu
      </Button>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>OTP đổi mật khẩu</span>
          <Input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Mật khẩu mới</span>
          <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Xác nhận mật khẩu mới</span>
          <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
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
        ) : (
          <p role="status" className="sr-only">
            Biểu mẫu đổi mật khẩu sẵn sàng.
          </p>
        )}

        <Button type="submit">Xác nhận đổi mật khẩu</Button>
      </form>
    </section>
  );
}
