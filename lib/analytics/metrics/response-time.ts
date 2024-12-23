import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { and, avg, between, eq } from 'drizzle-orm';
import { DateRange } from '../types';

export async function getAverageResponseTime(
  userId: string,
  dateRange: DateRange
): Promise<number> {
  const result = await db
    .select({
      averageHours: avg('response_time_hours'),
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

  return result[0]?.averageHours || 0;
}