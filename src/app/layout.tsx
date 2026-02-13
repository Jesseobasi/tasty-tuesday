import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '../context/Providers';
import { LayoutShell } from '../components/layout/LayoutShell';

export const metadata: Metadata = {
  title: 'Tasty Tuesday | Cozy Cooking Bookings',
  description: 'Book intimate cooking events with Tasty Tuesday. Modern, minimal, cozy vibes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-offwhite dark:bg-base text-base font-body">
      <body className="min-h-screen antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
