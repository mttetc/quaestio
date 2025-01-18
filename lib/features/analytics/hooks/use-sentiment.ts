"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import { readSentiment, readSentimentHeatmap } from "@/lib/features/analytics/queries/readSentiment";
import type { SentimentData, SentimentHeatmapData } from "@/lib/features/analytics/schemas/sentiment";

// Cache time configurations
const SENTIMENT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const SENTIMENT_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function useReadSentiment(dateRange: DateRange | undefined) {
    return useSuspenseQuery({
        queryKey: ["sentiment", "list", dateRange],
        queryFn: () => readSentiment(dateRange),
        staleTime: SENTIMENT_STALE_TIME,
        gcTime: SENTIMENT_CACHE_TIME,
    });
}

export function useReadSentimentHeatmap(dateRange: DateRange | undefined) {
    return useSuspenseQuery({
        queryKey: ["sentiment", "heatmap", dateRange],
        queryFn: () => readSentimentHeatmap(dateRange),
        staleTime: SENTIMENT_STALE_TIME,
        gcTime: SENTIMENT_CACHE_TIME,
    });
}
