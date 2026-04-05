import { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none ${props.className ?? ''}`.trim()}
    />
  );
}
