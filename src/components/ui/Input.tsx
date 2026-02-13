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
          'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-700 dark:bg-neutral-900 dark:text-offwhite dark:focus:border-white',
          className,
          error && 'border-red-400 focus:border-red-500 focus:ring-red-200'
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
});
