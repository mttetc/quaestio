'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { emailAccounts, qaEntries, type QAMetadata } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getEmailsByDateRange } from '@/lib/email/imap-connection';
import { extractQAFromEmail } from '@/lib/email/gmail-processor';
import { decryptPassword } from '@/lib/auth/encryption';

interface ExtractedQA {
  emailId: string;
  question: string;
  answer: string;
  context?: string;
  importance: 'low' | 'medium' | 'high';
  confidence: number;
  tags: string[];
  metadata: QAMetadata;
}

interface ExtractQAsResult {
  error?: string;
  success?: boolean;
  count?: number;
}

export async function extractQAs(formData: FormData): Promise<ExtractQAsResult> {
  const emailAccountId = formData.get('emailId') as string;
  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

  if (!emailAccountId || !startDate || !endDate) {
    return { error: 'Please provide an email account and date range' };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string) {
          cookieStore.set(name, value);
        },
        remove(name: string) {
          cookieStore.delete(name);
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    // Get email account
    const account = await db.query.emailAccounts.findFirst({
      where: and(
        eq(emailAccounts.id, emailAccountId),
        eq(emailAccounts.userId, user.id)
      )
    });

    if (!account) {
      return { error: 'Email account not found' };
    }

    // Decrypt app password and get emails
    const appPassword = await decryptPassword(account.accessToken);
    const emails = await getEmailsByDateRange(account.email, appPassword, startDate, endDate);

    // Extract QAs from emails
    const results: ExtractedQA[] = [];
    for (const email of emails) {
      const qas = await extractQAFromEmail(email);
      if (qas) {
        results.push(...qas.map(qa => ({
          ...qa,
          metadata: {
            subject: qa.metadata.subject || '',
            date: qa.metadata.date || new Date(),
            context: qa.metadata.context || null
          }
        })));
      }
    }

    // Store QAs in database
    if (results.length > 0) {
      await db.insert(qaEntries).values(
        results.map(qa => ({
          userId: user.id,
          emailId: qa.emailId,
          question: qa.question,
          answer: qa.answer,
          context: qa.context,
          importance: qa.importance || 'medium',
          confidence: qa.confidence,
          tags: qa.tags,
          metadata: qa.metadata,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );
    }

    return { success: true, count: results.length };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Failed to extract Q&As'
    };
  }
} 