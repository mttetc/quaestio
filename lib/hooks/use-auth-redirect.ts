"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/providers/supabase-provider';

export function useAuthRedirect() {
  const router = useRouter();
  const { session, isLoading } = useSupabase();

  useEffect(() => {
    if (!isLoading && session) {
      router.push('/dashboard');
    }
  }, [session, isLoading, router]);

  return { isLoading, isAuthenticated: !!session };
}