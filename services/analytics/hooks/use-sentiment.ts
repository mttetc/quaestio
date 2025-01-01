import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "../metrics";

export interface SentimentData {
    date: string;
    sentiment: "positive" | "negative" | "neutral";
    count: number;
    volume: number;
}

export interface SentimentHeatmapData {
    sentiment: SentimentData[];
}

export function useSentiment(dateRange: DateRange) {
    return useQuery<SentimentData[]>({
        queryKey: ["analytics", "sentiment", dateRange],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (dateRange.from) params.set('from', dateRange.from.toISOString());
            if (dateRange.to) params.set('to', dateRange.to.toISOString());
            
            const response = await fetch(`/api/analytics/sentiment?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch sentiment data');
            }

            return response.json();
        }
    });
}

export function useSentimentHeatmap(dateRange: DateRange) {
    return useQuery<SentimentHeatmapData>({
        queryKey: ["analytics", "sentiment-heatmap", dateRange],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (dateRange.from) params.set('from', dateRange.from.toISOString());
            if (dateRange.to) params.set('to', dateRange.to.toISOString());
            
            const response = await fetch(`/api/analytics/sentiment/heatmap?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch sentiment heatmap data');
            }

            return response.json();
        }
    });
} 