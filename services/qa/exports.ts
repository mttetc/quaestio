'use server';

import { db } from '@/services/db';
import { qaEntries } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/core/auth';
import { generateCSV } from '@/lib/shared/exports/csv';
import { generateHTML } from '@/lib/core/qa/exporters/html';
import { generateReactCode } from '@/lib/core/qa/exporters/react';

export type ExportFormat = 'csv' | 'html' | 'react';

export interface QAExport {
  id: string;
  question: string;
  answer: string;
  context?: string;
  importance: 'high' | 'medium' | 'low';
  confidence: number;
  tags: string[];
  emailId: string;
  metadata: {
    date: Date;
    subject?: string;
    category?: string;
  };
}

export async function exportQAs(format: ExportFormat, title: string, description?: string) {
  const user = await getCurrentUser();

  const qas = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, user.id),
  });

  // Map QAs to expected type
  const formattedQAs: QAExport[] = qas.map(qa => ({
    id: qa.id,
    question: qa.question,
    answer: qa.answer,
    context: qa.metadata?.context || undefined,
    importance: qa.importance as 'high' | 'medium' | 'low',
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