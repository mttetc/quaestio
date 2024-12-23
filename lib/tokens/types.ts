export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  stripePriceId: string;
  features: string[];
}

export interface TokenCosts {
  BASE: number;
  PER_KB: number;
  MINIMUM: number;
  MAXIMUM: number;
}

export type TokenTransactionType = 'purchase' | 'usage';