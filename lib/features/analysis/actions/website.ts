'use server';

import { ContentAnalysis } from '@/lib/infrastructure/ai/content-comparison';

export interface WebsiteAnalysisState {
    error?: string;
    analysis?: ContentAnalysis;
}

export async function analyzeWebsite(_: WebsiteAnalysisState, formData: FormData): Promise<WebsiteAnalysisState> {
    try {
        const url = formData.get('url') as string;
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analysis/website-comparison`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze website');
        }

        const analysis = await response.json();
        return { analysis };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Failed to analyze website'
        };
    }
} 