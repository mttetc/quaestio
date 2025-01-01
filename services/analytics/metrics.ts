import { db } from '@/services/db';
import { qaEntries } from '@/lib/core/db/schema';
import { and, between, eq, avg, count } from 'drizzle-orm';
import { analyzeSentiment } from '@/lib/infrastructure/ai/sentiment-analyzer';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsMetric {
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ResponseMetrics extends AnalyticsMetric {
  averageTimeHours: number;
  totalResponses: number;
}

export interface VolumeMetrics extends AnalyticsMetric {
  totalQuestions: number;
  byCategory: Record<string, number>;
}

export interface QualityMetrics extends AnalyticsMetric {
  averageConfidence: number;
  sentimentScore: number;
  helpfulnessScore: number;
}

export async function getResponseMetrics(
  userId: string,
  dateRange: DateRange
): Promise<ResponseMetrics> {
  const result = await db
    .select({
      averageTime: avg(qaEntries.responseTimeHours),
      total: count(),
    })
    .from(qaEntries)
    .where(
      and(
        eq(qaEntries.userId, userId),
        between(
          qaEntries.createdAt,
          dateRange.startDate,
          dateRange.endDate
        )
      )
    );

  return {
    value: Number(result[0]?.averageTime) || 0,
    averageTimeHours: Number(result[0]?.averageTime) || 0,
    totalResponses: Number(result[0]?.total) || 0,
  };
}

export async function getVolumeMetrics(
  userId: string,
  dateRange: DateRange
): Promise<VolumeMetrics> {
  const results = await db
    .select({
      category: qaEntries.category,
      count: count(),
    })
    .from(qaEntries)
    .where(
      and(
        eq(qaEntries.userId, userId),
        between(
          qaEntries.createdAt,
          dateRange.startDate,
          dateRange.endDate
        )
      )
    )
    .groupBy(qaEntries.category);

  const byCategory = results.reduce<Record<string, number>>((acc, { category, count }) => ({
    ...acc,
    [category || 'Uncategorized']: Number(count),
  }), {});

  const totalQuestions = Object.values(byCategory).reduce((a: number, b: number) => a + b, 0);

  return {
    value: totalQuestions,
    totalQuestions,
    byCategory,
  };
}

export async function getQualityMetrics(
  userId: string,
  dateRange: DateRange
): Promise<QualityMetrics> {
  const entries = await db.query.qaEntries.findMany({
    where: and(
      eq(qaEntries.userId, userId),
      between(
        qaEntries.createdAt,
        dateRange.startDate,
        dateRange.endDate
      )
    ),
  });

  const sentiments = await Promise.all(
    entries.map(entry => analyzeSentiment(entry.question, entry.answer))
  );

  const averageConfidence = entries.reduce((acc, entry) => acc + entry.confidence, 0) / entries.length;
  const sentimentScore = sentiments.reduce((acc, s) => acc + s.score, 0) / sentiments.length;

  return {
    value: averageConfidence,
    averageConfidence,
    sentimentScore,
    helpfulnessScore: sentimentScore * averageConfidence,
  };
} 