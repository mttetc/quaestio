import { z } from "zod";

export const sentimentAnalysisSchema = z.object({
    sentiment: z.enum(["positive", "negative", "neutral"]),
    score: z.number().min(-1).max(1),
    keywords: z.array(z.string()),
    confidence: z.number().min(0).max(100),
});

export type SentimentAnalysis = z.infer<typeof sentimentAnalysisSchema>;
