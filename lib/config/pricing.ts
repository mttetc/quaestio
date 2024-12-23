import { UserRole } from './roles';

export interface PricingTier {
  id: string;
  name: string;
  role: UserRole;
  price: number;
  stripePriceId: string | null;
  features: string[];
  highlighted?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    role: 'free',
    price: 0,
    stripePriceId: null,
    features: [
      'Connect 1 email account',
      '50 extractions per month',
      'Basic Q&A extraction',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    role: 'pro',
    price: 1999, // $19.99
    stripePriceId: 'price_pro',
    highlighted: true,
    features: [
      'Connect up to 3 email accounts',
      '1,000 extractions per month',
      'Advanced Q&A extraction',
      'Custom categories',
      'Priority support',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    role: 'enterprise',
    price: 4999, // $49.99
    stripePriceId: 'price_enterprise',
    features: [
      'Unlimited email accounts',
      'Unlimited extractions',
      'Custom AI model training',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ]
  }
];

export type TokenPackage = {
  readonly id: string;
  readonly name: string;
  readonly tokens: number;
  readonly price: number;
  readonly stripePriceId: string;
  readonly features: string[];
};

export const TOKEN_PACKAGES: Record<string, TokenPackage> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    tokens: 1000,
    price: 1000,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      '1,000 tokens',
      'Basic email analysis',
      'Standard support'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tokens: 5000,
    price: 4000,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      '5,000 tokens',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    tokens: 20000,
    price: 12000,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      '20,000 tokens',
      'Full analytics suite',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ]
  }
};