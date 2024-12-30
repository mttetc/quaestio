/**
 * Generates a key for a list item with a prefix and value
 */
export function generateKey(prefix: string, value: string | number): string {
  return `${prefix}-${value}`;
}

/**
 * Generates a key for a list item with multiple values
 */
export function generateCompositeKey(prefix: string, ...values: (string | number)[]): string {
  return `${prefix}-${values.join('-')}`;
}

/**
 * Generates a key for a question
 */
export function generateQuestionKey(question: string): string {
  return generateKey('question', question);
}

/**
 * Generates a key for a recommendation
 */
export function generateRecommendationKey(recommendation: string): string {
  return generateKey('rec', recommendation);
}

/**
 * Generates a key for a step
 */
export function generateStepKey(step: string): string {
  return generateKey('step', step);
}

/**
 * Generates a key for a measure
 */
export function generateMeasureKey(measure: string): string {
  return generateKey('measure', measure);
}

/**
 * Generates a key for a gap
 */
export function generateGapKey(topic: string, frequency: number): string {
  return generateCompositeKey('gap', topic, frequency);
}

/**
 * Generates a key for a tag
 */
export function generateTagKey(tag: string): string {
  return generateKey('tag', tag);
}

/**
 * Generates a key for a feature
 */
export function generateFeatureKey(title: string): string {
  return generateKey('feature', title);
}

/**
 * Generates a key for a tab
 */
export function generateTabKey(value: string): string {
  return generateKey('tab', value);
}

/**
 * Generates a key for a cell
 */
export function generateCellKey(name: string): string {
  return generateKey('cell', name);
}

/**
 * Generates a key for a FAQ category
 */
export function generateFAQCategoryKey(category: string): string {
  return generateKey('faq-category', category);
}

/**
 * Generates a key for a FAQ item
 */
export function generateFAQItemKey(question: string): string {
  return generateKey('faq-item', question);
}

/**
 * Generates a key for a heatmap cell
 */
export function generateHeatmapCellKey(row: number, col: number): string {
  return generateCompositeKey('heatmap', row, col);
}

/**
 * Generates a key for a package feature
 */
export function generatePackageFeatureKey(packageId: string, feature: string): string {
  return generateCompositeKey('package-feature', packageId, feature);
} 