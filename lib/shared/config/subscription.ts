export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    monthlyQuota: 10,
    features: ['Basic Q&A extraction', 'Email integration']
  },
  PRO: {
    name: 'Pro',
    monthlyQuota: 100,
    features: ['Advanced Q&A extraction', 'Priority support', 'Analytics']
  },
  ENTERPRISE: {
    name: 'Enterprise',
    monthlyQuota: 1000,
    features: ['Custom Q&A models', 'Dedicated support', 'Advanced analytics']
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS; 