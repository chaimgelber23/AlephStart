'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="font-[var(--font-hebrew-serif)] text-6xl text-[#1B4965] animate-pulse">
          א
        </div>
        <p className="text-gray-500">Confirming your account...</p>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      const type = searchParams.get('type');
      if (type === 'recovery') {
        router.replace('/settings?tab=password');
      } else {
        router.replace('/');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return <LoadingScreen />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
