import { load } from 'cheerio';
import { EmailSubscription } from '@/lib/shared/schemas/email';

export function detectSubscriptionEmails(emailContent: string, headers: Record<string, string>): Partial<EmailSubscription> {
  const $ = load(emailContent);
  
  // Common newsletter indicators
  const newsletterKeywords = [
    'unsubscribe',
    'subscription',
    'newsletter',
    'marketing',
    'update preferences',
    'email preferences',
    'manage subscriptions'
  ];

  // Find unsubscribe link
  const unsubscribeLink = findUnsubscribeLink($) || headers['list-unsubscribe'];
  const unsubscribeEmail = extractUnsubscribeEmail(headers['list-unsubscribe']);

  // Determine subscription type
  const type = determineSubscriptionType(emailContent, headers, newsletterKeywords);

  return {
    sender: headers.from,
    domain: extractDomain(headers.from),
    type,
    unsubscribeMethod: unsubscribeLink ? 'link' : unsubscribeEmail ? 'email' : 'unknown',
    unsubscribeData: {
      link: unsubscribeLink,
      email: unsubscribeEmail,
    },
    status: 'active',
  };
}

function findUnsubscribeLink($: any): string | undefined {
  // Look for common unsubscribe link patterns
  const unsubscribeLinks = $('a').filter((_: any, el: any) => {
    const text = $(el).text().toLowerCase();
    return text.includes('unsubscribe') || 
           text.includes('subscription') ||
           text.includes('opt out');
  });

  return unsubscribeLinks.first().attr('href');
}

function extractUnsubscribeEmail(listUnsubscribe?: string): string | undefined {
  if (!listUnsubscribe) return undefined;
  
  const emailMatch = listUnsubscribe.match(/<mailto:([^>]+)>/);
  return emailMatch ? emailMatch[1] : undefined;
}

function determineSubscriptionType(
  content: string, 
  headers: Record<string, string>,
  keywords: string[]
): EmailSubscription['type'] {
  const contentLower = content.toLowerCase();
  
  // Check if any newsletter keywords are present
  const hasNewsletterIndicators = keywords.some(keyword => 
    contentLower.includes(keyword.toLowerCase())
  );

  if (hasNewsletterIndicators) {
    if (contentLower.includes('marketing')) return 'marketing';
    if (contentLower.includes('update') || contentLower.includes('notification')) return 'updates';
    if (contentLower.includes('social') || headers.from.includes('social')) return 'social';
    return 'newsletter';
  }
  
  return 'other';
}

function extractDomain(email: string): string {
  const match = email.match(/@([^>]+)>/);
  return match ? match[1] : email.split('@')[1];
} 