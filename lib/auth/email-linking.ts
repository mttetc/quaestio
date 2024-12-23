'use client';

import { createBrowserClient } from '@supabase/ssr';
import { EmailLinkingStatus } from './types';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkEmailLinkingStatus(userId: string): Promise<EmailLinkingStatus> {
  const { data } = await supabase.from('email_accounts')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  return {
    hasLinkedEmail: Boolean(data && data.length > 0),
    emailCount: data?.length || 0
  };
}

export async function linkEmailAccount(userId: string, email: string, provider: string) {
  const { error } = await supabase.from('email_accounts').insert({
    user_id: userId,
    email,
    provider,
    access_token: '', // Will be populated after OAuth
    created_at: new Date().toISOString()
  });

  if (error) throw error;
}