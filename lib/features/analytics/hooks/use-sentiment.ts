"use client";

import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import { readSentiment, readSentimentHeatmap } from "@/lib/features/analytics/queries/readSentiment";
import type { SentimentData, SentimentHeatmapData } from "@/lib/features/analytics/schemas/sentiment";

export function useReadSentiment(dateRange: DateRange) {
    return useQuery<SentimentData[]>({
        queryKey: ["sentiment", "list", dateRange],
        queryFn: () => readSentiment(dateRange),
    });
}

export function useReadSentimentHeatmap(dateRange: DateRange) {
    return useQuery<SentimentHeatmapData>({
        queryKey: ["sentiment", "heatmap", dateRange],
        queryFn: () => readSentimentHeatmap(dateRange),
    });
}
