'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries, integrations } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { syncToNotion } from '@/lib/integrations/notion';
import { syncToTrello } from '@/lib/integrations/trello';
import { syncToClickUp } from '@/lib/integrations/clickup';
import { IntegrationType } from '@/lib/integrations/types';

export async function syncQAsToIntegration(integrationType: IntegrationType, qaIds: string[]) {
  const cookieStore = await cookies();
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

  // Get integration config
  const integration = await db.query.integrations.findFirst({
    where: and(
      eq(integrations.userId, user!.id),
      eq(integrations.type, integrationType)
    ),
  });

  if (!integration?.enabled) {
    throw new Error('Integration not configured');
  }

  // Get QA data
  const qas = await db.query.qaEntries.findMany({
    where: and(
      eq(qaEntries.userId, user!.id),
      inArray(qaEntries.id, qaIds)
    ),
  });

  // Map QAs to expected type
  const formattedData = qas.map(qa => ({
    question: qa.question,
    answer: qa.answer,
    context: qa.context || undefined,
    importance: qa.importance,
    confidence: qa.confidence,
    tags: qa.tags,
    emailId: qa.emailId,
    metadata: qa.metadata
  }));

  // Sync based on integration type
  switch (integrationType) {
    case 'notion':
      await syncToNotion(
        integration.config.apiKey,
        integration.config.databaseId!,
        formattedData
      );
      break;
    case 'trello':
      await syncToTrello(
        integration.config.apiKey,
        integration.config.token!,
        integration.config.boardId!,
        formattedData
      );
      break;
    case 'clickup':
      await syncToClickUp(
        integration.config.apiKey,
        integration.config.listId!,
        formattedData
      );
      break;
    default:
      throw new Error('Unsupported integration');
  }

  return { success: true };
} 