import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { and, between, count, eq } from 'drizzle-orm';
import { DateRange } from '../types';

export interface TagVolume {
  id: string;
  name: string;
  value: number;
}

export async function getVolumeByTag(
  userId: string,
  dateRange: DateRange
): Promise<TagVolume[]> {
  const volumes = await db
    .select({
      tag: qaEntries.tags,
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
    .groupBy(qaEntries.tags);

  return volumes.flatMap(v => 
    (v.tag || ['Uncategorized']).map(tag => ({
      id: `${tag}-volume`,
      name: tag,
      value: Number(v.count),
    }))
  );
}