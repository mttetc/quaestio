import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { sql } from "drizzle-orm";
import { QAMetrics } from "@/lib/schemas/qa";

export async function getResponseTimeMetrics(): Promise<QAMetrics["responseTime"]> {
    const result = await db
        .select({
            avgResponseTime: sql<number>`avg(extract(epoch from (updated_at - created_at)))`,
            minResponseTime: sql<number>`min(extract(epoch from (updated_at - created_at)))`,
            maxResponseTime: sql<number>`max(extract(epoch from (updated_at - created_at)))`,
        })
        .from(qaEntries)
        .where(sql`updated_at > created_at`);

    const [metrics] = result;
    return {
        average: Math.round(metrics.avgResponseTime || 0),
        minimum: Math.round(metrics.minResponseTime || 0),
        maximum: Math.round(metrics.maxResponseTime || 0),
    };
}

export async function getVolumeByTagMetrics(): Promise<QAMetrics["volumeByTag"]> {
    const result = await db
        .select({
            tag: sql<string>`unnest(tags)`,
            count: sql<number>`count(*)`,
        })
        .from(qaEntries)
        .groupBy(sql`unnest(tags)`)
        .orderBy(sql`count(*) desc`)
        .limit(10);

    return result.map(({ tag, count }) => ({
        tag,
        count: Number(count),
    }));
}
