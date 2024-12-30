'use server';

import { db } from '@/lib/core/db';
import { qaEntries } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/core/auth';
import { QAExtractionResult } from '@/lib/core/email/types';
import { generateCSV } from '@/lib/shared/exports/csv';
import { generateHTML } from '@/lib/core/qa/exporters/html';
import { generateReactCode } from '@/lib/core/qa/exporters/react';

export type ExportFormat = 'csv' | 'html' | 'react';

export async function exportQAs(format: ExportFormat, title: string, description?: string) {
  const user = await getCurrentUser();

  const qas = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, user.id),
  });

  // Map QAs to expected type
  const formattedQAs: QAExtractionResult[] = qas.map(qa => ({
    id: qa.id,
    question: qa.question,
    answer: qa.answer,
    context: qa.context || undefined,
    importance: qa.importance,
    confidence: qa.confidence,
    tags: qa.tags || [],
    emailId: qa.emailId || '',
    metadata: {
      date: qa.metadata?.date || new Date(),
      subject: qa.metadata?.subject,
      category: qa.category || undefined
    }
  }));

  switch (format) {
    case 'csv':
      return generateCSV(formattedQAs);
    case 'html':
      return generateHTML({ title, description, qas: formattedQAs });
    case 'react':
      return generateReactCode({ title, description, qas: formattedQAs });
    default:
      throw new Error('Unsupported export format');
  }
} 