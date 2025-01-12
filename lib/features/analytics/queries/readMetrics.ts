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
    let query = db
        .select({
            avgResponseTime: sql<number>`avg(extract(epoch from (updated_at - created_at)))`,
            totalCount: sql<number>`count(*)`,
        })
        .from(qaEntries)
        .where(
            dateRange?.from && dateRange?.to
                ? and(sql`updated_at > created_at`, between(qaEntries.createdAt, dateRange.from, dateRange.to))
                : sql`updated_at > created_at`
        );

    const result = await query;
    const [metrics] = result;

    const data = {
        averageTimeHours: Math.round(((metrics.avgResponseTime || 0) / 3600) * 10) / 10,
        totalResponses: Number(metrics.totalCount),
    };

    const parsed = responseMetricsSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid response metrics: ${parsed.error.message}`);
    }

    return parsed.data;
}

export async function readVolumeMetrics(
    dateRange?: DateRange
): Promise<VolumeMetrics & { byTag: VolumeByTagMetrics[] }> {
    const conditions = [];
    if (dateRange?.from && dateRange?.to) {
        conditions.push(between(qaEntries.createdAt, dateRange.from, dateRange.to));
    }

    const baseQuery = db
        .select()
        .from(qaEntries)
        .where(and(...conditions));

    // Get tag distribution
    const tagResult = await db
        .select({
            tag: sql<string>`unnest(tags)`,
            count: sql<number>`count(*)`,
        })
        .from(qaEntries)
        .groupBy(sql`unnest(tags)`)
        .orderBy(sql`count(*) desc`)
        .limit(10);

    // Get total questions
    const totalResult = await db
        .select({
            count: sql<number>`count(*)`,
        })
        .from(qaEntries);

    const byTag = tagResult.map(({ tag, count }) => ({
        tag,
        count: Number(count),
    }));

    const data = {
        totalQuestions: Number(totalResult[0].count),
        byCategory: Object.fromEntries(byTag.map(({ tag, count }) => [tag, count])),
        byTag,
    } as const;

    const volumeMetricsWithTagsSchema = volumeMetricsSchema.extend({
        byTag: z.array(volumeByTagMetricsSchema),
    });

    const parsed = volumeMetricsWithTagsSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid volume metrics: ${parsed.error.message}`);
    }

    return parsed.data;
}

export async function readQualityMetrics(dateRange?: DateRange): Promise<QualityMetrics> {
    const conditions = [];
    if (dateRange?.from && dateRange?.to) {
        conditions.push(between(qaEntries.createdAt, dateRange.from, dateRange.to));
    }

    const query = db
        .select({
            avgConfidence: sql<number>`avg(confidence)`,
            helpfulScore: sql<number>`count(*) filter (where importance = 'high')::float / count(*)`,
            sentimentScore: sql<number>`0.75`, // placeholder - implement actual sentiment analysis
        })
        .from(qaEntries)
        .where(and(...conditions));

    const [metrics] = await query;

    const data = {
        helpfulnessScore: Number(metrics.helpfulScore || 0),
        averageConfidence: Math.round(metrics.avgConfidence || 0) / 100,
        sentimentScore: Number(metrics.sentimentScore || 0),
    };

    const parsed = qualityMetricsSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`Invalid quality metrics: ${parsed.error.message}`);
    }

    return parsed.data;
}
