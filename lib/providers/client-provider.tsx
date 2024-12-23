"use client";

import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { SupabaseProvider } from './supabase-provider';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SupabaseProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </SupabaseProvider>
  );
}