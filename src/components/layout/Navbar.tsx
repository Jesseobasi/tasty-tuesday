'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/dashboard', label: 'My Booking' },
  { href: '/admin', label: 'Admin' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-20 bg-offwhite/90 dark:bg-[#0d0d0d]/80 backdrop-blur border-b border-neutral-100 dark:border-neutral-800">
      <div className="container-responsive flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white font-bold">TT</span>
          <span className="hidden sm:block">Tasty Tuesday</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks
            .filter((l) => (l.href === '/admin' ? isAdmin : true))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium hover:text-black ${pathname === link.href ? 'text-black' : 'text-muted'}`}
              >
                {link.label}
              </Link>
            ))}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {user ? (
            <Button variant="secondary" onClick={() => logout()}>
              Logout
            </Button>
          ) : (
            <Button variant="primary" onClick={() => (window.location.href = '/auth/login')}>
              Login
            </Button>
          )}
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-100 bg-offwhite">
          <div className="container-responsive flex flex-col gap-4 py-4">
            {navLinks
              .filter((l) => (l.href === '/admin' ? isAdmin : true))
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${pathname === link.href ? 'text-black' : 'text-muted'}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            <button
              className="inline-flex h-10 w-full items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700"
              onClick={() => {
                toggle();
                setOpen(false);
              }}
            >
              {theme === 'dark' ? 'Light theme' : 'Dark theme'}
            </button>
            {user ? (
              <Button variant="secondary" onClick={() => logout()}>
                Logout
              </Button>
            ) : (
              <Button variant="primary" onClick={() => (window.location.href = '/auth/login')}>
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
