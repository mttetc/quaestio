import { z } from "zod";

export const contentGapSchema = z.object({
    topic: z.string(),
    frequency: z.number(),
    relevance: z.number(),
    suggestedContent: z.string(),
    relatedQuestions: z.array(z.string()),
});

export const contentAnalysisSchema = z.object({
    similarity: z.number().min(0).max(1),
    differences: z.array(z.string()),
    suggestions: z.array(z.string()),
    coverage: z.number().min(0).max(1),
    gaps: z.array(contentGapSchema),
    recommendations: z.array(z.string()),
});

export type ContentGap = z.infer<typeof contentGapSchema>;
export type ContentAnalysis = z.infer<typeof contentAnalysisSchema>;
