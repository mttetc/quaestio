'use server';

import { getCurrentUser } from '@/lib/core/auth';
import { db } from '@/services/db';
import { qaEntries } from '@/lib/core/db/schema';
import { and, avg, between, eq } from 'drizzle-orm';

export async function getResponseTimeAnalytics(startDate: Date, endDate: Date) {
  const user = await getCurrentUser();

  const result = await db.select({
    averageResponseTime: avg(qaEntries.responseTimeHours)
  })
  .from(qaEntries)
  .where(
    and(
      eq(qaEntries.userId, user.id),
      between(qaEntries.createdAt, startDate, endDate)
    )
  );

  return result[0]?.averageResponseTime ?? 0;
} 