interface SubscriptionTierConfig {
  id: string;
  name: string;
  tokens: number;
  price: number;
  stripePriceId: string | undefined;
  monthlyQuota: number;
  maxEmailAccounts: number;
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTierConfig> = {
  FREE: {
    id: 'free',
    name: 'Free',
    tokens: 10,
    price: 0,
    stripePriceId: undefined,
    monthlyQuota: 10,
    maxEmailAccounts: 1,
    features: [
      'Basic email analysis',
      'Single email account',
      'Limited monthly extractions',
      'Community support'
    ]
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    tokens: 100,
    price: 9.99,
    stripePriceId: process.env.STRIPE_PRICE_STARTER,
    monthlyQuota: 100,
    maxEmailAccounts: 2,
    features: [
      '100 Q&A extraction tokens',
      'Connect 2 email accounts',
      'Basic support',
      'Never expire'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Professional',
    tokens: 500,
    price: 29.99,
    stripePriceId: process.env.STRIPE_PRICE_PRO,
    monthlyQuota: 500,
    maxEmailAccounts: 5,
    features: [
      'Advanced email analysis',
      'Up to 5 email accounts',
      'Priority support',
      'Export functionality',
      'Analytics dashboard',
      'Bulk extraction'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    tokens: 2000,
    price: 99.99,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE,
    monthlyQuota: -1, // unlimited
    maxEmailAccounts: -1, // unlimited
    features: [
      'Custom email analysis',
      'Unlimited email accounts',
      'Unlimited extractions',
      'Dedicated support',
      'Advanced analytics',
      'Custom integrations',
      'Team collaboration'
    ]
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export const hasUnlimitedQuota = (tier: SubscriptionTier) => 
  SUBSCRIPTION_TIERS[tier].monthlyQuota === -1;

export const EXTRACTION_COSTS = {
  BASE: 1,
  PER_KB: 0.5,
  MINIMUM: 1,
  MAXIMUM: 10,
} as const; 