'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function isEmailVerified(user: User): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('email_confirmed')
    .eq('id', user.id)
    .single();

  return data?.email_confirmed ?? false;
}

export async function sendVerificationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) throw error;
}