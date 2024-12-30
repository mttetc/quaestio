import { QAExtractionResult } from '@/lib/core/email/types';

export function generateCSV(qas: QAExtractionResult[]): string {
  const headers = ['Question', 'Answer', 'Importance', 'Confidence', 'Tags', 'Subject', 'Date'];
  const rows = qas.map(qa => [
    qa.question,
    qa.answer,
    qa.importance,
    qa.confidence.toString(),
    qa.tags.join(';'),
    qa.metadata?.subject || '',
    qa.metadata?.date.toISOString() || ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');
} 