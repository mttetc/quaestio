export function deriveCategory(tags: string[]): string | undefined {
  const categoryMap: Record<string, string[]> = {
    'technical': ['bug', 'error', 'issue', 'feature', 'development'],
    'support': ['help', 'assistance', 'guidance', 'support'],
    'billing': ['payment', 'subscription', 'pricing', 'billing'],
    'product': ['feature', 'product', 'enhancement', 'improvement'],
    'general': ['information', 'question', 'inquiry']
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (tags.some(tag => keywords.includes(tag.toLowerCase()))) {
      return category;
    }
  }

  return undefined;
} 