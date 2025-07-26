'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is disabled (mock user exists) or user is logged in, go to dashboard.
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  // Render a loading state while checking auth status
  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
  );
}
