import { TokenPackage, TokenCosts } from './types';

export const TOKEN_PACKAGES: Record<string, TokenPackage> = {
  STARTER: {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 100,
    price: 499,
    stripePriceId: 'price_starter',
    features: [
      '100 Q&A extraction tokens',
      'Connect 1 email account',
      'Basic support',
      'Never expire'
    ]
  },
  PLUS: {
    id: 'plus',
    name: 'Plus Pack',
    tokens: 500,
    price: 1999,
    stripePriceId: 'price_plus',
    features: [
      '500 Q&A extraction tokens',
      'Connect up to 3 email accounts',
      'Priority support',
      'Never expire',
      'Bulk extraction'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Pro Pack',
    tokens: 2000,
    price: 4999,
    stripePriceId: 'price_pro',
    features: [
      '2000 Q&A extraction tokens',
      'Unlimited email accounts',
      'Premium support',
      'Never expire',
      'Bulk extraction',
      'Custom AI model fine-tuning'
    ]
  }
};

export const EXTRACTION_COSTS: TokenCosts = {
  BASE: 1,
  PER_KB: 0.5,
  MINIMUM: 1,
  MAXIMUM: 10,
};