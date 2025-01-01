import { QA } from '@/lib/shared/schemas/qa';
import { WebPage } from '../integrations/web-scraper';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { chatModel } from './config';

export interface ContentGap {
  topic: string;
  frequency: number;
  relevance: number;
  suggestedContent: string;
  relatedQuestions: string[];
}

export interface ContentAnalysis {
  gaps: ContentGap[];
  coverage: number;
  recommendations: string[];
}

const prompt = ChatPromptTemplate.fromPromptMessages([
  HumanMessagePromptTemplate.fromTemplate(`
Analyze the relationship between customer questions and website content.
Identify gaps where frequently asked questions aren't well-addressed on the website.

Website Content:
{websiteContent}

Customer Q&As:
{qaContent}

Return analysis as JSON:
{
  "gaps": [
    {
      "topic": "Main topic/theme of the gap",
      "frequency": number (1-10) of how often this comes up in questions,
      "relevance": number (0-1) indicating importance,
      "suggestedContent": "Specific suggestion for new content",
      "relatedQuestions": ["List of related customer questions"]
    }
  ],
  "coverage": number (0-1) indicating how well website covers Q&A topics,
  "recommendations": ["Prioritized list of content recommendations"]
}
`)
]);

export async function analyzeContentGaps(
  website: WebPage,
  qas: QA[]
): Promise<ContentAnalysis> {
  const qaContent = qas
    .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
    .join('\n\n');

  const messages = await prompt.formatMessages({
    websiteContent: `
      Title: ${website.title}
      Headings: ${website.headings.join(' | ')}
      Content: ${website.content}
    `,
    qaContent,
  });

  const response = await chatModel.invoke(messages);
  const result = JSON.parse(response.text) as ContentAnalysis;
  return result;
} 