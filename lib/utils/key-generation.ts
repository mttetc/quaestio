import { createHash } from 'crypto';

export function generateQuestionKey(question: string): string {
    return createHash('sha256')
        .update(question.toLowerCase().trim())
        .digest('hex');
}

export function generateCategoryKey(category: string): string {
    return createHash('sha256')
        .update(category.toLowerCase().trim())
        .digest('hex');
}

export function generateItemKey(question: string): string {
    return createHash('sha256')
        .update(question.toLowerCase().trim())
        .digest('hex');
}

export function generateHeatmapCellKey(row: number, col: number): string {
    return `heatmap-cell-${row}-${col}`;
}

export function generateGapKey(topic: string, frequency: number): string {
    return `gap-${topic}-${frequency}`;
}

export function generateRecommendationKey(recommendation: string): string {
    return createHash('sha256')
        .update(recommendation.toLowerCase().trim())
        .digest('hex');
}

export function generatePackageFeatureKey(packageId: string, feature: string): string {
    return `package-${packageId}-feature-${feature.toLowerCase().replace(/\s+/g, '-')}`;
} 