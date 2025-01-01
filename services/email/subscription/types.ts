export interface EmailSubscription {
  id: string;
  sender: string;
  domain: string;
  type: 'newsletter' | 'marketing' | 'updates' | 'social' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
  lastReceived: Date;
  emailCount: number;
  unsubscribeMethod: 'link' | 'email' | 'form' | 'unknown';
  unsubscribeData?: {
    link?: string;
    email?: string;
    formUrl?: string;
  };
  status: 'active' | 'unsubscribing' | 'unsubscribed' | 'failed';
  lastAttempt?: Date;
}

export interface UnsubscribeResult {
  success: boolean;
  error?: string;
  status: 'completed' | 'pending' | 'failed';
  message: string;
} 