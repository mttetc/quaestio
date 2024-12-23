'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { generateAutoResponse } from '@/lib/ai/response-generator';
import { clusterSimilarQuestions } from '@/lib/ai/question-clustering';
import { getSolutionsForQA } from '@/lib/solution/solution-service';

export async function generateResponse(question: string, tags: string[]) {
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

  // Find similar past Q&As
  const similarQAs = await db.query.qaEntries.findMany({
    where: and(
      eq(qaEntries.userId, user!.id),
      sql`${qaEntries.tags} && ARRAY[${sql.join(tags)}]::text[]`
    ),
    limit: 5,
  });

  // Map QAs to expected type
  const formattedQAs = similarQAs.map(qa => ({
    question: qa.question,
    answer: qa.answer,
    context: qa.context || undefined,
    importance: qa.importance,
    confidence: qa.confidence,
    tags: qa.tags,
    emailId: qa.emailId,
    metadata: qa.metadata
  }));

  // Cluster similar questions to avoid redundancy
  const clusters = clusterSimilarQuestions(formattedQAs);
  
  // Generate response using the most relevant cluster
  const mostRelevantCluster = clusters
    .sort((a, b) => b.averageConfidence - a.averageConfidence)[0];

  return generateAutoResponse(
    question,
    formattedQAs.filter(qa => 
      mostRelevantCluster.similarQuestions.includes(qa.question)
    )
  );
}

export async function getSolutions(qaId: string) {
  return getSolutionsForQA(qaId);
} 