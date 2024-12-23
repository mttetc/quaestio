'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { scrapeWebsite } from '@/lib/analysis/web-scraper';
import { analyzeContentGaps } from '@/lib/analysis/content-comparison';

export async function compareWithWebsite(url: string) {
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

  if (!url) {
    throw new Error('Website URL is required');
  }

  // Get user's Q&As
  const qas = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, user!.id),
    orderBy: (qaEntries, { desc }) => [desc(qaEntries.createdAt)],
    limit: 100, // Analyze most recent 100 Q&As
  });

  // Scrape website content
  const websiteContent = await scrapeWebsite(url);

  // Map QAs to expected type
  const formattedQAs = qas.map(qa => ({
    question: qa.question,
    answer: qa.answer,
    context: qa.context || undefined,
    importance: qa.importance,
    confidence: qa.confidence,
    tags: qa.tags,
    emailId: qa.emailId,
    metadata: qa.metadata
  }));

  // Analyze gaps between website content and Q&As
  return analyzeContentGaps(websiteContent, formattedQAs);
} 