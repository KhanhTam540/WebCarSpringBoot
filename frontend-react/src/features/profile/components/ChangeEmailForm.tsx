import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../../../api/profileApi';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

type ChangeEmailFormProps = {
  currentEmail: string;
  onEmailUpdated: (newEmail: string) => void;
};

export function ChangeEmailForm({ currentEmail, onEmailUpdated }: ChangeEmailFormProps) {
  const [otpCode, setOtpCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'alert' | 'status'; message: string } | null>(null);

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
    mutationFn: () => profileApi.verifyChangeEmail({ otpCode, newEmail }),
    onSuccess: (message) => {
      onEmailUpdated(newEmail);
      setFeedback({ type: 'status', message });
      setOtpCode('');
      setNewEmail('');
    },
    onError: (error) => {
      setFeedback({ type: 'alert', message: error instanceof Error ? error.message : 'Không thể đổi email.' });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    submitMutation.mutate();
  }

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/60 p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Đổi email</h2>
        <p className="text-sm text-slate-500">Email hiện tại: {currentEmail}</p>
      </div>

      <Button type="button" variant="secondary" onClick={() => sendOtpMutation.mutate()}>
        Gửi mã OTP đổi email
      </Button>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>OTP đổi email</span>
          <Input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-800">
          <span>Email mới</span>
          <Input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
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
            Biểu mẫu đổi email sẵn sàng.
          </p>
        )}

        <Button type="submit">Xác nhận đổi email</Button>
      </form>
    </section>
  );
}
