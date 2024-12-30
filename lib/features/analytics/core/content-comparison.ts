import { QAExtractionResult } from '../email/types';
import { WebPage } from './web-scraper';
import { OpenAI } from 'openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';

export interface ContentGap {
  topic: string;
  frequency: number;
  relevance: number;
  suggestedContent: string;
  relatedQuestions: string[];
}

export interface ContentAnalysis {
  gaps: ContentGap[];
  coverage: number; // 0-1 score of how well the website covers Q&A topics
  recommendations: string[];
}

const analysisPrompt = PromptTemplate.fromTemplate(`
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
`);

export async function analyzeContentGaps(
  website: WebPage,
  qas: QAExtractionResult[]
): Promise<ContentAnalysis> {
  const model = new ChatOpenAI({
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.2,
  });

  const chain = new LLMChain({
    prompt: analysisPrompt,
    llm: model,
  });

  const qaContent = qas
    .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
    .join('\n\n');

  const result = await chain.call({
    websiteContent: `
      Title: ${website.title}
      Headings: ${website.headings.join(' | ')}
      Content: ${website.content}
    `,
    qaContent,
  });

  return JSON.parse(result.text);
}