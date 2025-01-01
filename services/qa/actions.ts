'use server';

import { getCurrentUser } from '@/lib/core/auth';
import { db } from '@/services/db';
import { qaEntries, type QAMetadata } from '@/lib/core/db/schema';
import { createQASchema, updateQASchema } from '@/lib/shared/schemas/qa';
import { and, arrayContains, between, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { CreateQAInput, QAFilter, UpdateQAInput } from '@/lib/shared/schemas/qa';
import { extractQAFromEmail } from '@/services/ai/qa-extractor';

function deriveCategory(tags: string[]): string | undefined {
  const categoryMap: Record<string, string[]> = {
    'technical': ['bug', 'error', 'issue', 'feature', 'development'],
    'support': ['help', 'assistance', 'guidance', 'support'],
    'billing': ['payment', 'subscription', 'pricing', 'billing'],
    'product': ['feature', 'product', 'enhancement', 'improvement'],
    'general': ['information', 'question', 'inquiry']
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (tags.some(tag => keywords.includes(tag.toLowerCase()))) {
      return category;
    }
  }

  return undefined;
}

export async function createQA(input: CreateQAInput) {
  try {
    const user = await getCurrentUser();
    const validatedData = createQASchema.parse(input);
    const category = validatedData.tags ? deriveCategory(validatedData.tags) : undefined;

    const metadata: QAMetadata = {
      date: new Date(),
      subject: validatedData.metadata?.subject,
      context: validatedData.metadata?.context || null
    };

    const [qa] = await db.insert(qaEntries)
      .values({
        question: validatedData.question,
        answer: validatedData.answer,
        importance: validatedData.importance,
        confidence: validatedData.confidence,
        tags: validatedData.tags,
        emailId: validatedData.emailId,
        userId: user.id,
        category,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    revalidatePath('/dashboard/qa');
    return qa;
  } catch (error) {
    console.error('Error creating QA:', error);
    throw new Error('Failed to create QA');
  }
}

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

export async function updateQA(id: string, input: UpdateQAInput) {
  try {
    const user = await getCurrentUser();
    const validatedData = updateQASchema.parse(input);
    const category = validatedData.tags ? deriveCategory(validatedData.tags) : undefined;
    const metadata: QAMetadata = validatedData.metadata ? {
      date: validatedData.metadata.date || new Date(),
      subject: validatedData.metadata.subject || undefined,
      category,
      context: validatedData.metadata.context || null
    } : {
      date: new Date(),
      subject: undefined,
      category: undefined,
      context: null
    };

    const [qa] = await db
      .update(qaEntries)
      .set({
        ...validatedData,
        metadata
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

export async function extractQAs(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const emailId = formData.get("emailId") as string;
    const dateRange = formData.get("dateRange") as string;
    const range = dateRange ? JSON.parse(dateRange) : { from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() };

    // Get emails from the specified date range
    const response = await fetch(`/api/email/messages?emailId=${emailId}&from=${range.from.toISOString()}&to=${range.to.toISOString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }

    const emails = await response.json();
    const failureReasons: string[] = [];
    let failedEmails = 0;
    let totalQAs = 0;

    // Process each email
    for (const email of emails) {
      try {
        // Extract QAs from the email
        const qas = await extractQAFromEmail(email);
        
        // Create QA entries in the database
        for (const qa of qas) {
          await createQA({
            question: qa.question,
            answer: qa.answer,
            importance: qa.importance,
            confidence: qa.confidence,
            tags: qa.tags,
            emailId: qa.emailId,
            metadata: qa.metadata
          });
          totalQAs++;
        }
      } catch (error) {
        failureReasons.push(`Failed to process email "${email.subject}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        failedEmails++;
      }
    }

    revalidatePath('/dashboard/qa');
    return { count: totalQAs, failedEmails, failureReasons };
  } catch (error) {
    console.error('Error extracting QAs:', error);
    return { error: error instanceof Error ? error.message : 'Failed to extract QAs' };
  }
} 