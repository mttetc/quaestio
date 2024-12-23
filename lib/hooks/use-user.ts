"use client";

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/lib/providers/supabase-provider';

export function useUser() {
  const { session } = useSupabase();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    },
    enabled: !!session,
  });
}