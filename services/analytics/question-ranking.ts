import { db } from '@/services/db';
import { qaEntries } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';

export interface QuestionAnalytics {
  totalQuestions: number;
  averageConfidence: number;
  importanceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  topTags: Array<{
    tag: string;
    count: number;
  }>;
}

export async function updateQuestionAnalytics(userId: string): Promise<QuestionAnalytics> {
  // Get all QA entries for the user
  const entries = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, userId),
  });

  // Calculate analytics
  const totalQuestions = entries.length;
  const averageConfidence = entries.reduce((acc, entry) => acc + entry.confidence, 0) / totalQuestions;

  // Calculate importance distribution
  const importanceDistribution = entries.reduce(
    (acc, entry) => {
      acc[entry.importance as keyof typeof acc]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  // Calculate tag frequency
  const tagCounts = new Map<string, number>();
  entries.forEach(entry => {
    entry.tags?.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Get top tags
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  return {
    totalQuestions,
    averageConfidence,
    importanceDistribution,
    topTags,
  };
} 