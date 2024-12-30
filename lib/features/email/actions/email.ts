import { z } from 'zod';
import { db } from '@/lib/core/db';
import { emailAccounts } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/core/auth';
import { encryptPassword } from '@/lib/core/auth/encryption';

export interface EmailFormState {
  error?: string;
  success?: boolean;
}

const emailConnectionSchema = z.object({
  email: z.string().email().endsWith('@gmail.com'),
  appPassword: z.string().length(16)
});

export async function connectEmail(_: EmailFormState, formData: FormData): Promise<EmailFormState> {
  try {
    const validatedData = emailConnectionSchema.parse({
      email: formData.get('email'),
      appPassword: formData.get('appPassword')
    });

    const user = await getCurrentUser();

    // Check if email is already connected
    const existingAccount = await db.query.emailAccounts.findFirst({
      where: eq(emailAccounts.email, validatedData.email)
    });

    if (existingAccount) {
      return { error: 'This email account is already connected' };
    }

    // Encrypt app password
    const encryptedPassword = await encryptPassword(validatedData.appPassword);

    // Store email account
    await db.insert(emailAccounts).values({
      userId: user.id,
      email: validatedData.email,
      accessToken: encryptedPassword,
      provider: 'gmail',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Email connection error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to connect email account' };
  }
} 