'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { and, eq, sql, desc, avg, between } from 'drizzle-orm';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export async function getVolumeByTag() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  const results = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, user!.id),
    columns: {
      tags: true
    }
  });

  const tagCounts = results.reduce((acc, qa) => {
    qa.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return tagCounts;
}

export async function getQuestionAnalysis(dateRange?: DateRange, limit: number = 10) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  const whereClause = dateRange 
    ? and(
        eq(qaEntries.userId, user!.id),
        sql`${qaEntries.createdAt} >= ${dateRange.startDate}`,
        sql`${qaEntries.createdAt} <= ${dateRange.endDate}`
      )
    : eq(qaEntries.userId, user!.id);

  const questions = await db.query.qaEntries.findMany({
    where: whereClause,
    columns: {
      question: true,
      answer: true,
      importance: true,
      confidence: true,
      createdAt: true,
      tags: true
    },
    orderBy: [desc(qaEntries.confidence)],
    limit
  });

  return questions.map(q => ({
    question: q.question,
    importance: q.importance,
    confidence: q.confidence,
    tags: q.tags,
    createdAt: q.createdAt
  }));
}

export async function getResponseTimeAnalytics(dateRange: DateRange) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  const result = await db
    .select({
      averageHours: avg(qaEntries.responseTimeHours),
    })
    .from(qaEntries)
    .where(
      and(
        eq(qaEntries.userId, user!.id),
        between(
          qaEntries.createdAt,
          dateRange.startDate,
          dateRange.endDate
        )
      )
    );

  return {
    averageHours: result[0]?.averageHours || 0
  };
} 