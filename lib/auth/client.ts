"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { AuthError, AuthResponse, User, Session } from "@supabase/supabase-js";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CustomAuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: AuthError | null;
}

export async function signUpWithEmail(email: string, password: string): Promise<CustomAuthResponse> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        email_confirmed: true
      }
    }
  });

  if (authError) return { data: authData, error: authError };

  // Create user in public.users table if auth signup was successful
  if (authData.user) {
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        role: 'free'
      });

    if (dbError) {
      console.error('Error creating user in public.users:', dbError);
      return { data: authData, error: new Error('Failed to create user profile') as AuthError };
    }
  }

  return { data: authData, error: null };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}