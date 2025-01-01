'use client';

import { useQuery } from '@tanstack/react-query';
import type { DateRange } from '../metrics';

export interface ResponseMetrics {
    averageTimeHours: number;
    totalResponses: number;
}

export interface VolumeMetrics {
    totalQuestions: number;
    byCategory: Record<string, number>;
}

export interface QualityMetrics {
    helpfulnessScore: number;
    averageConfidence: number;
    sentimentScore: number;
}

function useMetricsQuery<T>(endpoint: string, dateRange: DateRange) {
    return useQuery({
        queryKey: ['metrics', endpoint, dateRange],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (dateRange.from) params.set('from', dateRange.from.toISOString());
            if (dateRange.to) params.set('to', dateRange.to.toISOString());
            
            const response = await fetch(`/api/analytics/metrics/${endpoint}?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch metrics');
            }

            return response.json() as Promise<T>;
        }
    });
}

export function useResponseMetrics(dateRange: DateRange) {
    return useMetricsQuery<ResponseMetrics>('response', dateRange);
}

export function useVolumeMetrics(dateRange: DateRange) {
    return useMetricsQuery<VolumeMetrics>('volume', dateRange);
}

export function useQualityMetrics(dateRange: DateRange) {
    return useMetricsQuery<QualityMetrics>('quality', dateRange);
} 