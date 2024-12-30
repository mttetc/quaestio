export const TOKEN_PACKAGES = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    tokens: 100,
    price: 9.99,
    stripePriceId: process.env.STRIPE_PRICE_STARTER,
    monthlyQuota: 100
  },
  PRO: {
    id: 'pro',
    name: 'Professional',
    tokens: 500,
    price: 29.99,
    stripePriceId: process.env.STRIPE_PRICE_PRO,
    monthlyQuota: 500
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    tokens: 2000,
    price: 99.99,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE,
    monthlyQuota: 2000
  }
} as const; 