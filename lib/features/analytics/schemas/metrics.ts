import { z } from "zod";

export const responseTimeMetricsSchema = z
    .object({
        average: z.number().min(0),
        minimum: z.number().min(0),
        maximum: z.number().min(0),
    })
    .refine((data) => data.minimum <= data.average && data.average <= data.maximum, {
        message: "Average must be between minimum and maximum",
    });

export const responseMetricsSchema = z.object({
    averageTimeHours: z.number().min(0),
    totalResponses: z.number().int().min(0),
});

export const volumeByTagMetricsSchema = z.object({
    tag: z.string().min(1),
    count: z.number().int().min(0),
});

export const volumeMetricsSchema = z.object({
    totalQuestions: z.number().int().min(0),
    byCategory: z.record(z.string().min(1), z.number().int().min(0)),
});

export const qualityMetricsSchema = z.object({
    helpfulnessScore: z.number().min(0).max(100),
    averageConfidence: z.number().min(0).max(100),
    sentimentScore: z.number().min(-1).max(1),
});

export const timeRangeSchema = z
    .object({
        start: z.date(),
        end: z.date(),
    })
    .refine((data) => data.start <= data.end, {
        message: "Start date must be before or equal to end date",
    });

export const metricsRequestSchema = z.object({
    timeRange: timeRangeSchema,
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

export type ResponseTimeMetrics = z.infer<typeof responseTimeMetricsSchema>;
export type ResponseMetrics = z.infer<typeof responseMetricsSchema>;
export type VolumeByTagMetrics = z.infer<typeof volumeByTagMetricsSchema>;
export type VolumeMetrics = z.infer<typeof volumeMetricsSchema>;
export type QualityMetrics = z.infer<typeof qualityMetricsSchema>;
export type TimeRange = z.infer<typeof timeRangeSchema>;
export type MetricsRequest = z.infer<typeof metricsRequestSchema>;
