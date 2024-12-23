import { EXTRACTION_COSTS } from './config';

export function calculateTokenCost(contentSizeKB: number): number {
  const baseCost = EXTRACTION_COSTS.BASE;
  const additionalCost = Math.ceil(contentSizeKB * EXTRACTION_COSTS.PER_KB);
  const totalCost = Math.min(
    Math.max(baseCost + additionalCost, EXTRACTION_COSTS.MINIMUM),
    EXTRACTION_COSTS.MAXIMUM
  );
  
  return totalCost;
}

export function formatTokenAmount(amount: number): string {
  return `${amount.toLocaleString()} token${amount === 1 ? '' : 's'}`;
}

export function formatPrice(price: number): string {
  return `$${(price / 100).toFixed(2)}`;
}