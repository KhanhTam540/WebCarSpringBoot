import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const variantClassName =
    variant === 'primary'
      ? 'bg-brand-500 text-slate-950 hover:bg-brand-400'
      : 'bg-slate-50 text-slate-900 hover:bg-slate-200';

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition ${variantClassName} ${className}`.trim()}
    />
  );
}
