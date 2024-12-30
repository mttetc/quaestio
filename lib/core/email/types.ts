export interface EmailContent {
  id: string;
  content: string;
  metadata: {
    subject?: string;
    date: Date;
    [key: string]: any;
  };
}

export interface EmailExtractor {
  extractEmails(startDate: Date, endDate: Date): Promise<EmailContent[]>;
}

export interface EmailSearchParams {
  startDate: Date;
  endDate: Date;
  emailAccountId: string;
}

export interface QAExtractionResult {
  id: string;
  emailId: string;
  question: string;
  answer: string;
  context?: string;
  confidence: number;
  importance: 'high' | 'medium' | 'low';
  tags: string[];
  metadata: {
    subject?: string;
    date: Date;
    category?: string;
    [key: string]: any;
  };
}