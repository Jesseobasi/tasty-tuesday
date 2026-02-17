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
      'bg-accent text-white hover:bg-accentHover shadow-[0_20px_50px_-20px_rgba(255,79,121,0.75)] focus:ring-accent focus:ring-offset-base',
    secondary:
      'bg-surface text-offwhite border border-neutral-700 hover:border-accent focus:ring-accent focus:ring-offset-base shadow-[0_12px_30px_-22px_rgba(0,0,0,0.7)]',
    ghost:
      'text-offwhite hover:bg-neutral-800 focus:ring-accent focus:ring-offset-base',
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
