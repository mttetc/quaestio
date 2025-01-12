import type { DateRange } from "react-day-picker";
import { z } from "zod";
import {
    sentimentDataSchema,
    sentimentHeatmapDataSchema,
    type SentimentData,
    type SentimentHeatmapData,
} from "@/lib/features/analytics/schemas/sentiment";

export async function readSentiment(dateRange: DateRange): Promise<SentimentData[]> {
    const params = new URLSearchParams();
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());

    const response = await fetch(`/api/analytics/sentiment?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch sentiment data");
    }

    const data = await response.json();
    const parsed = z.array(sentimentDataSchema).safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid sentiment data: ${parsed.error.message}`);
    }

    return parsed.data;
}

export async function readSentimentHeatmap(dateRange: DateRange): Promise<SentimentHeatmapData> {
    const params = new URLSearchParams();
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());

    const response = await fetch(`/api/analytics/sentiment-heatmap?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch sentiment heatmap data");
    }

    const data = await response.json();
    const parsed = sentimentHeatmapDataSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid sentiment heatmap data: ${parsed.error.message}`);
    }

    return parsed.data;
}
