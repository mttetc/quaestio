'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateFAQ } from '@/lib/ai/faq-generator';

export async function generateFAQFromQAs() {
  const cookieStore =await  cookies();
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

  // Get user's Q&As
  const qas = await db.query.qaEntries.findMany({
    where: eq(qaEntries.userId, user!.id),
    orderBy: (qaEntries, { desc }) => [desc(qaEntries.confidence)],
    limit: 100 // Use top 100 most confident Q&As
  });

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

  // Generate FAQ content
  const faqContent = await generateFAQ(formattedQAs);

  return faqContent;
} 