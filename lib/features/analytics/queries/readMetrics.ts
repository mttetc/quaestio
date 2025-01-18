"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { sql, and, between } from "drizzle-orm";
import { z } from "zod";
import type { DateRange } from "react-day-picker";
import {
    responseMetricsSchema,
    volumeMetricsSchema,
    volumeByTagMetricsSchema,
    qualityMetricsSchema,
    type ResponseMetrics,
    type VolumeMetrics,
    type QualityMetrics,
    type VolumeByTagMetrics,
} from "@/lib/features/analytics/schemas/metrics";

export async function readResponseTimeMetrics(dateRange?: DateRange): Promise<ResponseMetrics> {
    try {
        const query = db
            .select({
                avgResponseTime: sql<number>`avg(response_time_hours)`,
                minResponseTime: sql<number>`min(response_time_hours)`,
                maxResponseTime: sql<number>`max(response_time_hours)`,
                totalCount: sql<number>`count(*)`,
            })
            .from(qaEntries)
            .where(
                dateRange?.from && dateRange?.to
                    ? and(
                        sql`response_time_hours is not null`,
                        between(qaEntries.createdAt, dateRange.from, dateRange.to)
                    )
                    : sql`response_time_hours is not null`
            );

        const result = await query;
        const [metrics] = result;

        const parsed = responseMetricsSchema.safeParse({
            averageTimeHours: metrics.avgResponseTime || 0,
            fastestResponseHours: metrics.minResponseTime || 0,
            slowestResponseHours: metrics.maxResponseTime || 0,
            totalResponses: metrics.totalCount || 0,
        });

        if (!parsed.success) {
            throw new Error(`Invalid response time metrics: ${parsed.error.message}`);
        }

        return parsed.data;
    } catch (error) {
        console.error("Failed to read response time metrics:", error);
        throw error;
    }
}

export async function readVolumeMetrics(
    dateRange?: DateRange
): Promise<VolumeMetrics & { byTag: VolumeByTagMetrics[] }> {
    try {
        const volumeQuery = db
            .select({
                totalQuestions: sql<number>`count(*)`,
                answeredQuestions: sql<number>`count(*) filter (where answered = true)`,
                unansweredQuestions: sql<number>`count(*) filter (where answered = false)`,
            })
            .from(qaEntries)
            .where(
                dateRange?.from && dateRange?.to
                    ? between(qaEntries.createdAt, dateRange.from, dateRange.to)
                    : undefined
            );

        const byTagQuery = db
            .select({
                tags: qaEntries.tags,
                count: sql<number>`count(*)`,
            })
            .from(qaEntries)
            .where(
                dateRange?.from && dateRange?.to
                    ? between(qaEntries.createdAt, dateRange.from, dateRange.to)
                    : undefined
            )
            .groupBy(qaEntries.tags);

        const [volumeResult, byTagResult] = await Promise.all([volumeQuery, byTagQuery]);
        const [volume] = volumeResult;

        const parsedVolume = volumeMetricsSchema.safeParse(volume);
        if (!parsedVolume.success) {
            throw new Error(`Invalid volume metrics: ${parsedVolume.error.message}`);
        }

        const parsedByTag = z.array(volumeByTagMetricsSchema).safeParse(byTagResult);
        if (!parsedByTag.success) {
            throw new Error(`Invalid volume by tag metrics: ${parsedByTag.error.message}`);
        }

        return {
            ...parsedVolume.data,
            byTag: parsedByTag.data,
        };
    } catch (error) {
        console.error("Error reading volume metrics:", error);
        throw new Error("Failed to read volume metrics");
    }
}

export async function readQualityMetrics(dateRange?: DateRange): Promise<QualityMetrics> {
    try {
        const query = db
            .select({
                avgRating: sql<number>`avg(rating)`,
                totalRatings: sql<number>`count(*) filter (where rating is not null)`,
                positiveRatings: sql<number>`count(*) filter (where rating >= 4)`,
                negativeRatings: sql<number>`count(*) filter (where rating <= 2)`,
            })
            .from(qaEntries)
            .where(
                dateRange?.from && dateRange?.to
                    ? between(qaEntries.createdAt, dateRange.from, dateRange.to)
                    : undefined
            );

        const result = await query;
        const [metrics] = result;

        const parsed = qualityMetricsSchema.safeParse({
            avgRating: metrics.avgRating || 0,
            totalRatings: metrics.totalRatings || 0,
            positiveRatings: metrics.positiveRatings || 0,
            negativeRatings: metrics.negativeRatings || 0,
        });

        if (!parsed.success) {
            throw new Error(`Invalid quality metrics: ${parsed.error.message}`);
        }

        return parsed.data;
    } catch (error) {
        console.error("Error reading quality metrics:", error);
        throw new Error("Failed to read quality metrics");
    }
}