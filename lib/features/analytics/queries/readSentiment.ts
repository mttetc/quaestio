"use server";

import type { DateRange } from "react-day-picker";
import { z } from "zod";
import {
    sentimentDataSchema,
    sentimentHeatmapDataSchema,
    type SentimentData,
    type SentimentHeatmapData,
} from "@/lib/features/analytics/schemas/sentiment";

export async function readSentiment(dateRange?: DateRange): Promise<SentimentData[]> {
    try {
        const params = new URLSearchParams();
        if (dateRange?.from) params.set("from", dateRange.from.toISOString());
        if (dateRange?.to) params.set("to", dateRange.to.toISOString());

        const response = await fetch(`/api/analytics/sentiment?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sentiment data: ${response.statusText}`);
        }

        const data = await response.json();
        const parsed = z.array(sentimentDataSchema).safeParse(data);
        if (!parsed.success) {
            throw new Error(`Invalid sentiment data: ${parsed.error.message}`);
        }

        return parsed.data;
    } catch (error) {
        console.error("Error reading sentiment data:", error);
        throw new Error("Failed to read sentiment data");
    }
}

export async function readSentimentHeatmap(dateRange?: DateRange): Promise<SentimentHeatmapData> {
    try {
        const params = new URLSearchParams();
        if (dateRange?.from) params.set("from", dateRange.from.toISOString());
        if (dateRange?.to) params.set("to", dateRange.to.toISOString());

        const response = await fetch(`/api/analytics/sentiment/heatmap?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sentiment heatmap data: ${response.statusText}`);
        }

        const data = await response.json();
        const parsed = sentimentHeatmapDataSchema.safeParse(data);
        if (!parsed.success) {
            throw new Error(`Invalid sentiment heatmap data: ${parsed.error.message}`);
        }

        return parsed.data;
    } catch (error) {
        console.error("Error reading sentiment heatmap data:", error);
        throw new Error("Failed to read sentiment heatmap data");
    }
}
