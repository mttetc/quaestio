import { z } from "zod";
import { questionAnalytics } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type QuestionAnalytic = InferSelectModel<typeof questionAnalytics>;

export const questionAnalyticsSchema = z.object({
    question: z.string(),
    frequency: z.number(),
    lastAsked: z.string(),
    tags: z.array(z.string()),
    confidence: z.number(),
});

export const questionChartDataSchema = z.object({
    date: z.string(),
    count: z.number(),
});

export type QuestionAnalytics = z.infer<typeof questionAnalyticsSchema>;
export type QuestionChartData = z.infer<typeof questionChartDataSchema>;
