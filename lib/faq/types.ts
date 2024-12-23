export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  tags: string[];
  metadata?: {
    lastUpdated: Date;
    views?: number;
    helpful?: number;
  };
}

export interface FAQSection {
  title: string;
  description?: string;
  items: FAQItem[];
}

export interface FAQConfig {
  title: string;
  description?: string;
  sections: FAQSection[];
  styling?: {
    theme: 'light' | 'dark' | 'auto';
    accentColor?: string;
    fontFamily?: string;
  };
}