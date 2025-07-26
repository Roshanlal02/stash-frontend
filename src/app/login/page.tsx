'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Wallet className="h-8 w-8 text-primary" />
                </div>
            </div>
          <CardTitle className="text-2xl font-bold">Wallet Scanner</CardTitle>
          <CardDescription>Sign in to continue to your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
