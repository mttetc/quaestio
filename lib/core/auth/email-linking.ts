'use client';

import { EmailLinkingStatus } from './types';
import { supabase } from '../supabase/client';

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