'use client';

import clsx from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, error, className, ...props }, ref) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-neutral-800">
      {label}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-xl border border-neutral-800 bg-[#0f1626] px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent text-offwhite placeholder:text-neutral-500',
          className,
          error && 'border-red-400 focus:border-red-500 focus:ring-red-200'
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
});
