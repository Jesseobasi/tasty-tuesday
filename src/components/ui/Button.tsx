'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export const Button = ({
  className,
  children,
  variant = 'primary',
  disabled,
  loading,
  ...rest
}: Props) => {
  const base = 'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles: Record<typeof variant, string> = {
    primary:
      'bg-black text-white hover:bg-neutral-900 shadow-cozy focus:ring-accent focus:ring-offset-offwhite dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:focus:ring-offset-base',
    secondary:
      'bg-offwhite text-black border border-neutral-200 hover:border-black focus:ring-accent focus:ring-offset-offwhite dark:bg-neutral-900 dark:text-offwhite dark:border-neutral-700 dark:hover:border-white dark:focus:ring-offset-base',
    ghost:
      'text-black hover:bg-neutral-100 focus:ring-accent focus:ring-offset-offwhite dark:text-offwhite dark:hover:bg-neutral-800 dark:focus:ring-offset-base',
  } as const;

  return (
    <button
      className={clsx(base, styles[variant], className, (disabled || loading) && 'opacity-60 cursor-not-allowed')}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
};
