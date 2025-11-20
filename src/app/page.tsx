
'use client';

import { redirect, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
          redirect('/dashboard');
        }
      } else {
        if (pathname !== '/login' && pathname !== '/signup') {
          redirect('/login');
        }
      }
    }
  }, [user, isUserLoading, pathname]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }
  
  // This is a guard; actual rendering happens in layouts/pages
  // based on the redirection logic above.
  return null;
}
