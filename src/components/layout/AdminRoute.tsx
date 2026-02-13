'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/');
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner label="Checking admin access" />
      </div>
    );
  }

  return <>{children}</>;
};
