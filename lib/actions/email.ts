"use server";

import { emailConnectionSchema } from '@/lib/email/validation';

export interface EmailFormState {
  error?: string;
  success?: boolean;
}

export async function connectEmail(_: EmailFormState, formData: FormData): Promise<EmailFormState> {
  try {
    const validatedData = emailConnectionSchema.parse({
      email: formData.get("email"),
      appPassword: formData.get("appPassword")
    });

    const response = await fetch('/api/email/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to connect email account');
    }

    return { success: true };
  } catch (error) {
    console.error('Email connection error:', error);
    
    let errorMessage = 'Failed to connect email account';
    if (error instanceof Error) {
      if (error.message.includes('IMAP')) {
        errorMessage = 'Failed to connect to Gmail. Please verify your app password and ensure IMAP is enabled.';
      } else if (error.message.includes('already connected')) {
        errorMessage = 'This email account is already connected to your account.';
      } else {
        errorMessage = error.message;
      }
    }

    return { error: errorMessage };
  }
}
