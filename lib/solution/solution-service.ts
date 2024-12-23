import { eq, arrayOverlaps } from 'drizzle-orm';
import { QAPair } from '../ai/qa-extractor';
import { generateSolutions } from '../ai/solution-generator';
import { db } from '../db';
import { qaEntries } from '../db/schema';

export async function getSolutionsForQA(qaId: string): Promise<any> {
  const qa = await db.query.qaEntries.findFirst({
    where: eq(qaEntries.id, qaId),
  });

  if (!qa) {
    throw new Error('Q&A entry not found');
  }

  const solutions = await generateSolutions(
    qa.question,
    qa.answer,
    qa.context || '',
    qa.tags || [],
    qa.importance
  );

  return solutions;
}

export async function getSolutionsForSimilarIssues(
  question: string,
  tags: string[]
): Promise<QAPair[]> {
  // Find similar questions based on tags
  const similarQAs = await db.query.qaEntries.findMany({
    where: arrayOverlaps(qaEntries.tags, tags),
    limit: 5,
  });

  return similarQAs.map(qa => ({
    question: qa.question,
    answer: qa.answer,
    confidence: qa.confidence,
    context: qa.context || undefined,
    importance: qa.importance,
    tags: qa.tags
  }));
}