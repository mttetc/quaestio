import { z } from "zod";

export const sentimentDataSchema = z.object({
    type: z.enum(["positive", "negative", "neutral"]),
    count: z.number(),
    percentage: z.number(),
});

export const sentimentHeatmapDataSchema = z.object({
    sentiment: z.array(
        z.object({
            date: z.string(),
            sentiment: z.enum(["positive", "negative", "neutral"]),
            count: z.number(),
            volume: z.number(),
        })
    ),
});

export type SentimentData = z.infer<typeof sentimentDataSchema>;
export type SentimentHeatmapData = z.infer<typeof sentimentHeatmapDataSchema>;
