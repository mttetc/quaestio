interface SubscriptionTierConfig {
  name: string;
  monthlyQuota: number;
  maxEmailAccounts: number;
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTierConfig> = {
  FREE: {
    name: 'Free',
    monthlyQuota: 10,
    maxEmailAccounts: 1,
    features: [
      'Basic email analysis',
      'Single email account',
      'Limited monthly extractions',
      'Community support'
    ]
  },
  PRO: {
    name: 'Pro',
    monthlyQuota: 100,
    maxEmailAccounts: 5,
    features: [
      'Advanced email analysis',
      'Up to 5 email accounts',
      'Increased monthly extractions',
      'Priority support',
      'Export functionality',
      'Analytics dashboard'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    monthlyQuota: -1,
    maxEmailAccounts: -1,
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