import { QAExtractionResult } from '@/lib/email/types';

const formatCSV = (headers: string[], rows: string[][]): string => {
  return [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');
};

export const generateCSV = (data: QAExtractionResult[]): string => {
  const headers = ['Question', 'Answer', 'Category', 'Date', 'Confidence', 'Tags'];
  const rows = data.map(qa => [
    qa.question,
    qa.answer,
    qa.metadata.category || 'Uncategorized',
    new Date(qa.metadata.date).toISOString(),
    qa.confidence.toString(),
    qa.tags.join('; ')
  ]);

  return formatCSV(headers, rows);
};

export const getCSVFilename = () => 'qa-export.csv';
export const getCSVMimeType = () => 'text/csv';