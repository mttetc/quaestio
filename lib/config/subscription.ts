export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    monthlyQuota: 100,
    features: [
      'Connect 1 email account',
      'Process up to 100 emails per month',
      'Basic Q&A extraction',
      'Email support'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 1999, // $19.99
    monthlyQuota: 1000,
    features: [
      'Connect up to 3 email accounts',
      'Process up to 1,000 emails per month',
      'Advanced Q&A extraction',
      'Custom categories',
      'Priority support'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999, // $49.99
    monthlyQuota: 5000,
    features: [
      'Unlimited email accounts',
      'Process up to 5,000 emails per month',
      'Advanced Q&A extraction with custom training',
      'Custom integrations',
      'Dedicated support',
      'Custom AI model fine-tuning'
    ]
  }
};