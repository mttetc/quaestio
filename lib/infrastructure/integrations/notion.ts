import { Client } from '@notionhq/client';
import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { QA } from '@/lib/shared/schemas/qa';

export async function syncToNotion(
  apiKey: string,
  databaseId: string,
  data: QA[]
) {
  const notion = new Client({ auth: apiKey });

  const pages = data.map(qa => {
    const page: CreatePageParameters = {
      parent: { database_id: databaseId },
      properties: {
        Question: {
          type: 'title',
          title: [{ type: 'text', text: { content: qa.question } }]
        },
        Answer: {
          type: 'rich_text',
          rich_text: [{ type: 'text', text: { content: qa.answer } }]
        },
        Category: {
          type: 'select',
          select: { name: qa.metadata?.category || 'Uncategorized' }
        },
        Tags: {
          type: 'multi_select',
          multi_select: qa.tags.map(tag => ({ name: tag }))
        },
        Confidence: {
          type: 'number',
          number: qa.confidence
        },
        Date: {
          type: 'date',
          date: { start: (qa.metadata?.date || new Date()).toISOString() }
        }
      }
    };
    return page;
  });

  // Create pages in batches to respect API limits
  const batchSize = 10;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    await Promise.all(
      batch.map(page => notion.pages.create(page))
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}