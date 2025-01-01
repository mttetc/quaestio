import { createHash } from 'crypto';
import { db } from '@/services/db';
import { questionAnalytics } from '@/lib/core/db/schema';
import { eq, desc, and, between } from 'drizzle-orm';
import type { DateRange } from '@/services/analytics/metrics';

export interface QuestionRankingResult {
  question: string;
  occurrences: number;
  category?: string;
  firstSeen: Date;
  lastSeen: Date;
  averageConfidence: number;
  trend: 'up' | 'down' | 'stable';
}

export function generateQuestionHash(question: string): string {
  // Normalize the question by removing punctuation and converting to lowercase
  const normalized = question
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
  
  return createHash('sha256')
    .update(normalized)
    .digest('hex');
}

export async function updateQuestionAnalytics(
  userId: string,
  question: string,
  category: string | null,
  confidence: number,
  date: Date
): Promise<void> {
  const questionHash = generateQuestionHash(question);

  const existing = await db.query.questionAnalytics.findFirst({
    where: and(
      eq(questionAnalytics.userId, userId),
      eq(questionAnalytics.questionHash, questionHash)
    ),
  });

  if (existing) {
    const newOccurrences = existing.occurrences + 1;
    const newAvgConfidence = Math.round(
      (existing.averageConfidence * existing.occurrences + confidence) / newOccurrences
    );

    await db.update(questionAnalytics)
      .set({
        occurrences: newOccurrences,
        lastSeen: date,
        averageConfidence: newAvgConfidence,
        category: category || existing.category,
      })
      .where(eq(questionAnalytics.id, existing.id));
  } else {
    await db.insert(questionAnalytics).values({
      userId,
      questionHash,
      question,
      category: category || undefined,
      occurrences: 1,
      firstSeen: date,
      lastSeen: date,
      averageConfidence: confidence,
    });
  }
}

export async function getTopQuestions(
  userId: string,
  dateRange?: DateRange,
  limit: number = 10
): Promise<QuestionRankingResult[]> {
  let query = db.query.questionAnalytics.findMany({
    where: eq(questionAnalytics.userId, userId),
    orderBy: [desc(questionAnalytics.occurrences)],
    limit,
  });

  if (dateRange) {
    query = db.query.questionAnalytics.findMany({
      where: and(
        eq(questionAnalytics.userId, userId),
        between(questionAnalytics.lastSeen, dateRange.startDate, dateRange.endDate)
      ),
      orderBy: [desc(questionAnalytics.occurrences)],
      limit,
    });
  }

  const results = await query;

  return results.map(result => {
    // Calculate trend based on recent occurrences
    const daysSinceFirstSeen = Math.floor(
      (result.lastSeen.getTime() - result.firstSeen.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const averageOccurrencesPerDay = result.occurrences / (daysSinceFirstSeen || 1);
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (averageOccurrencesPerDay > 2) trend = 'up';
    if (averageOccurrencesPerDay < 0.5) trend = 'down';

    return {
      question: result.question,
      occurrences: result.occurrences,
      category: result.category || undefined,
      firstSeen: result.firstSeen,
      lastSeen: result.lastSeen,
      averageConfidence: result.averageConfidence,
      trend,
    };
  });
} 