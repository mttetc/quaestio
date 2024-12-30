'use server';

import { createClient } from '@/lib/infrastructure/supabase/server';
import { revalidatePath } from 'next/cache';

export async function checkEmailVerification() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { verified: false, shouldRedirect: '/login' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email_confirmed_at) {
    return { verified: false, shouldRedirect: '/verify-email' };
  }

  return { verified: true, shouldRedirect: null };
}

export async function resendVerificationEmail() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) {
    throw new Error('No email found');
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: session.user.email,
  });

  if (error) {
    throw error;
  }

  revalidatePath('/verify-email');
  return { success: true };
}