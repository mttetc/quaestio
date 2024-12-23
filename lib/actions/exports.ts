'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateCSV, getCSVFilename, getCSVMimeType } from '@/lib/exports/exporters/csv';
import { QAExtractionResult } from '@/lib/email/types';

export type ExportFormat = 'csv';

export async function exportQAs(format: ExportFormat) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  // Get all user's Q&As
  const qas = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, user!.id),
    orderBy: (qaEntries, { desc }) => [desc(qaEntries.createdAt)],
  });

  // Map QAs to expected type
  const formattedQAs: QAExtractionResult[] = qas.map(qa => ({
    question: qa.question,
    answer: qa.answer,
    emailId: qa.emailId,
    importance: qa.importance,
    confidence: qa.confidence,
    tags: qa.tags,
    metadata: {
      category: qa.importance,
      date: qa.createdAt
    }
  }));

  // Generate export in requested format
  switch (format) {
    case 'csv':
      return {
        content: generateCSV(formattedQAs),
        filename: getCSVFilename(),
        mimeType: getCSVMimeType()
      };
    default:
      throw new Error('Unsupported export format');
  }
} 