export type ExportFormat = 'html' | 'react' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
}

export interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
}

export interface FAQConfig {
  title: string;
  description?: string;
  styling?: {
    theme?: 'light' | 'dark' | 'auto';
    accentColor?: string;
    fontFamily?: string;
  };
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
      tags: string[];
    }>;
  }>;
}

export interface Exporter {
  format: ExportFormat;
  generateContent: (data: any, options?: ExportOptions) => string;
  getFilename: () => string;
  getMimeType: () => string;
}