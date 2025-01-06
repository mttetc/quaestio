export function formatTokenAmount(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }
  return amount.toString();
}

export function calculateTokenCost(tokens: number): number {
  const COST_PER_TOKEN = 0.001;
  return tokens * COST_PER_TOKEN;
} 