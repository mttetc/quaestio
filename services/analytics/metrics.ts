import { db } from '@/services/db';
import { qaEntries } from '@/lib/core/db/schema';
import { and, between, eq, avg, count } from 'drizzle-orm';
import { analyzeSentiment } from '@/lib/infrastructure/ai/sentiment-analyzer';

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface AnalyticsMetric {
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ResponseMetrics extends AnalyticsMetric {
  averageTimeHours: number;
  totalResponses: number;
}

export interface VolumeMetrics extends AnalyticsMetric {
  totalQuestions: number;
  byCategory: Record<string, number>;
}

export interface QualityMetrics extends AnalyticsMetric {
  averageConfidence: number;
  sentimentScore: number;
  helpfulnessScore: number;
}

export async function getResponseMetrics(dateRange: DateRange): Promise<ResponseMetrics> {
    const params = new URLSearchParams({
        from: dateRange.from?.toISOString() ?? '',
        to: dateRange.to?.toISOString() ?? ''
    });

    const response = await fetch(`/api/analytics/metrics/response?${params}`);
    if (!response.ok) {
        throw new Error('Failed to fetch response metrics');
    }

    return response.json();
}

export async function getVolumeMetrics(dateRange: DateRange): Promise<VolumeMetrics> {
    const params = new URLSearchParams({
        from: dateRange.from?.toISOString() ?? '',
        to: dateRange.to?.toISOString() ?? ''
    });

    const response = await fetch(`/api/analytics/metrics/volume?${params}`);
    if (!response.ok) {
        throw new Error('Failed to fetch volume metrics');
    }

    return response.json();
}

export async function getQualityMetrics(dateRange: DateRange): Promise<QualityMetrics> {
    const params = new URLSearchParams({
        from: dateRange.from?.toISOString() ?? '',
        to: dateRange.to?.toISOString() ?? ''
    });

    const response = await fetch(`/api/analytics/metrics/quality?${params}`);
    if (!response.ok) {
        throw new Error('Failed to fetch quality metrics');
    }

    return response.json();
} 