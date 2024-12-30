import { db } from '../db';
import { qaEntries } from '../db/schema';
import { eq, and, between } from 'drizzle-orm';
import { extractGmailEmails } from './extractors/gmail-extractor';
import { extractQAPairs } from '../ai/qa-extractor';
import { updateQuestionAnalytics } from '../analytics/question-ranking';
import { EmailSearchParams, QAExtractionResult } from './types';

export async function getQAForDateRange(
  userId: string,
  params: EmailSearchParams
): Promise<QAExtractionResult[]> {
  // Get email account credentials
  const emailAccount = await db.query.emailAccounts.findFirst({
    where: eq(emailAccounts.id, params.emailAccountId),
  });

  if (!emailAccount) {
    throw new Error('Email account not found');
  }

  // Extract emails
  const emails = await extractGmailEmails(
    emailAccount.accessToken,
    emailAccount.refreshToken || undefined,
    params.startDate,
    params.endDate
  );

  // Process each email
  const results: QAExtractionResult[] = [];
  
  for (const email of emails) {
    const qaPairs = await extractQAPairs(email.content);
    
    for (const qa of qaPairs) {
      const result: QAExtractionResult = {
        emailId: email.id,
        question: qa.question,
        answer: qa.answer,
        context: qa.context,
        confidence: qa.confidence,
        importance: qa.importance,
        tags: qa.tags || [],
        metadata: {
          ...email.metadata,
          category: qa.tags?.[0],
        },
      };

      // Store in database
      await db.insert(qaEntries).values({
        userId,
        emailId: email.id,
        question: qa.question,
        answer: qa.answer,
        context: qa.context,
        confidence: qa.confidence,
        importance: qa.importance,
        tags: qa.tags,
        metadata: result.metadata,
      });

      // Update analytics
      await updateQuestionAnalytics(
        userId,
        qa.question,
        qa.tags?.[0],
        qa.confidence,
        new Date()
      );

      results.push(result);
    }
  }

  return results;
}