import { db } from '@/lib/core/db';
import { qaEntries } from '@/lib/core/db/schema';
import { and, avg, between, eq } from 'drizzle-orm';
import { DateRange } from '../types';

export async function getAverageResponseTime(
  userId: string,
  dateRange: DateRange
): Promise<number> {
  const result = await db
    .select({
      averageHours: avg(qaEntries.responseTimeHours),
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

  return Number(result[0]?.averageHours) || 0;
}