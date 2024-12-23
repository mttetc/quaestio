import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { and, between, eq, avg, count } from 'drizzle-orm';
import { 
  DateRange, 
  ResponseMetrics, 
  VolumeMetrics,
  QualityMetrics 
} from '../types';
import { analyzeSentiment } from '@/lib/ai/sentiment-analyzer';

export async function getResponseMetrics(
  userId: string,
  dateRange: DateRange
): Promise<ResponseMetrics> {
  const result = await db
    .select({
      averageTime: avg('response_time_hours'),
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
    value: result[0]?.averageTime || 0,
    averageTimeHours: result[0]?.averageTime || 0,
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

  const byCategory = results.reduce((acc, { category, count }) => ({
    ...acc,
    [category || 'Uncategorized']: Number(count),
  }), {});

  const totalQuestions = Object.values(byCategory).reduce((a, b) => a + b, 0);

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