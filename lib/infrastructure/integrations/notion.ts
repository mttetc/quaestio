import { Client } from '@notionhq/client';
import { QAExtractionResult } from '../email/types';

export async function syncToNotion(
  apiKey: string,
  databaseId: string,
  data: QAExtractionResult[]
) {
  const notion = new Client({ auth: apiKey });

  const pages = data.map(qa => ({
    parent: { database_id: databaseId },
    properties: {
      Question: {
        title: [{ text: { content: qa.question } }]
      },
      Answer: {
        rich_text: [{ text: { content: qa.answer } }]
      },
      Category: {
        select: {
          name: qa.metadata.category || 'Uncategorized'
        }
      },
      Tags: {
        multi_select: qa.tags.map(tag => ({ name: tag }))
      },
      Confidence: {
        number: qa.confidence
      },
      Date: {
        date: {
          start: qa.metadata.date
        }
      }
    }
  }));

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