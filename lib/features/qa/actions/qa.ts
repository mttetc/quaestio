'use server';

import { getCurrentUser } from '@/lib/core/auth/index';
import { db } from '@/lib/core/db';
import { qaEntries, type QAMetadata } from '@/lib/core/db/schema';
import { createQASchema, updateQASchema } from '@/lib/shared/schemas/qa';
import { and, arrayContains, between, eq, type SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { CreateQAInput, QAFilter, UpdateQAInput } from '@/lib/shared/types/qa';
import { decryptPassword } from '@/lib/core/auth/encryption';
import { emailAccounts } from '@/lib/core/db/schema';
import { extractQAFromEmail } from '@/lib/core/email/gmail-processor';
import { getEmailsByDateRange } from '@/lib/core/email/imap-connection';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getQAs(filter?: QAFilter) {
  try {
    const user = await getCurrentUser();
    const conditions = [eq(qaEntries.userId, user.id)];

    if (filter?.tags?.length) {
      conditions.push(arrayContains(qaEntries.tags, filter.tags));
    }

    if (filter?.importance) {
      conditions.push(eq(qaEntries.importance, filter.importance));
    }

    if (filter?.dateRange) {
      conditions.push(between(
        qaEntries.createdAt,
        filter.dateRange.from,
        filter.dateRange.to
      ));
    }

    return await db
      .select()
      .from(qaEntries)
      .where(and(...conditions));
  } catch (error) {
    console.error('Error fetching QAs:', error);
    throw new Error('Failed to fetch QAs');
  }
}

function deriveCategory(tags: string[]): string {
  // Define primary categories based on common themes
  const categoryMappings: Record<string, string[]> = {
    'Technical': ['bug', 'error', 'code', 'development', 'api', 'database'],
    'Product': ['feature', 'product', 'ui', 'ux', 'design', 'roadmap'],
    'Support': ['help', 'support', 'issue', 'problem', 'assistance'],
    'Sales': ['pricing', 'subscription', 'payment', 'billing', 'cost'],
    'General': ['info', 'information', 'general', 'other']
  };

  // Find matching category based on tags
  for (const [category, keywords] of Object.entries(categoryMappings)) {
    if (tags.some(tag => keywords.some(keyword => tag.toLowerCase().includes(keyword)))) {
      return category;
    }
  }

  return 'Uncategorized';
}

export async function createQA(input: CreateQAInput) {
  try {
    const user = await getCurrentUser();
    const category = deriveCategory(input.tags);
    const metadata: QAMetadata = {
      date: input.metadata?.date || new Date(),
      subject: input.metadata?.subject,
      category: input.metadata?.category,
      context: input.metadata?.context ?? null
    };

    const [qa] = await db
      .insert(qaEntries)
      .values({
        ...input,
        userId: user.id,
        category,
        metadata
      })
      .returning();
    
    revalidatePath('/dashboard/qa');
    return qa;
  } catch (error: unknown) {
    console.error('Error creating QA:', error);
    throw new Error('Failed to create QA');
  }
}

export async function updateQA(id: string, input: UpdateQAInput) {
  try {
    const user = await getCurrentUser();
    const category = input.tags ? deriveCategory(input.tags) : undefined;
    const metadata: QAMetadata | undefined = input.metadata ? {
      date: input.metadata.date || new Date(),
      subject: input.metadata.subject,
      category: input.metadata.category,
      context: input.metadata.context ?? null
    } : undefined;

    const [qa] = await db
      .update(qaEntries)
      .set({
        ...input,
        ...(category && { category }),
        ...(metadata && { metadata })
      })
      .where(and(
        eq(qaEntries.id, id),
        eq(qaEntries.userId, user.id)
      ))
      .returning();
    
    revalidatePath('/dashboard/qa');
    return qa;
  } catch (error: unknown) {
    console.error('Error updating QA:', error);
    throw new Error('Failed to update QA');
  }
}

export async function deleteQA(id: string) {
  try {
    const user = await getCurrentUser();
    await db
      .delete(qaEntries)
      .where(and(
        eq(qaEntries.id, id),
        eq(qaEntries.userId, user.id)
      ));

    revalidatePath('/dashboard/qa');
  } catch (error) {
    console.error('Error deleting QA:', error);
    throw new Error('Failed to delete QA');
  }
}

interface FormState {
  message?: string;
  error?: string | null;
  fieldErrors: Record<string, string[]>;
}

export async function submitQA(qa: { id: string } | undefined, prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    emailId: formData.get('emailId')?.toString(),
    question: formData.get('question')?.toString(),
    answer: formData.get('answer')?.toString(),
    tags: formData.get('tags')?.toString().split(',').filter(Boolean).map(t => t.trim()) || [],
    importance: formData.get('importance') as 'high' | 'medium' | 'low',
    confidence: Number(formData.get('confidence')),
    metadata: {
      subject: formData.get('subject')?.toString(),
      date: new Date(),
      context: null
    }
  };

  try {
    if (qa) {
      const result = updateQASchema.safeParse(rawData);
      if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        result.error.errors.forEach((error) => {
          const field = error.path.join('.');
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(error.message);
        });
        return { error: null, fieldErrors };
      }
      await updateQA(qa.id, result.data);
      revalidatePath('/dashboard/qa');
      return { message: 'QA updated successfully', fieldErrors: {} };
    }

    const result = createQASchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.errors.forEach((error) => {
        const field = error.path.join('.');
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(error.message);
      });
      return { error: null, fieldErrors };
    }
    await createQA(result.data);
    revalidatePath('/dashboard/qa');
    return { message: 'QA created successfully', fieldErrors: {} };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Something went wrong',
      fieldErrors: {}
    };
  }
}


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
  failedEmails?: number;
  failureReasons?: string[];
}

export async function extractQAs(formData: FormData): Promise<ExtractQAsResult> {
  try {
    const user = await getCurrentUser();
    const emailAccountId = formData.get('emailId') as string;
    const dateRangeStr = formData.get('dateRange') as string;

    if (!emailAccountId || !dateRangeStr) {
      return { error: 'Please provide an email account and date range' };
    }

    const dateRange = JSON.parse(dateRangeStr);
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: 'Invalid date range provided' };
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

    if (!emails.length) {
      return { success: true, count: 0 };
    }

    // Extract QAs from emails
    const results: ExtractedQA[] = [];
    const failures: string[] = [];
    let failedCount = 0;

    for (const email of emails) {
      try {
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
      } catch (error) {
        failedCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing email ${email.subject || 'unknown'}:`, error);
        failures.push(`Failed to process email "${email.subject || 'unknown'}": ${errorMessage}`);
      }
    }

    if (results.length === 0) {
      if (failedCount > 0) {
        return {
          error: `Failed to extract any Q&As. ${failedCount} emails failed processing.`,
          failedEmails: failedCount,
          failureReasons: failures
        };
      }
      return { success: true, count: 0 };
    }

    // Store QAs in database
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

    revalidatePath('/dashboard/qa');
    return {
      success: true,
      count: results.length,
      ...(failedCount > 0 ? {
        failedEmails: failedCount,
        failureReasons: failures
      } : {})
    };
  } catch (error) {
    console.error('Error extracting QAs:', error);
    if (error instanceof Error) {
      if (error.message.includes('IMAP')) {
        return { error: 'Failed to connect to email server' };
      }
      if (error.message.includes('decrypt')) {
        return { error: 'Failed to access email account' };
      }
      return { error: error.message };
    }
    return { error: 'Failed to extract Q&As' };
  }
} 