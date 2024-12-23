import { openai } from './config';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentAnalysis {
  sentiment: Sentiment;
  score: number;
  keywords: string[];
  confidence: number;
}

export async function analyzeSentiment(
  question: string,
  answer: string
): Promise<SentimentAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a sentiment analysis expert. Respond only with valid JSON.'
      },
      {
        role: 'user',
        content: `Analyze the sentiment of this Q&A exchange:
Question: ${question}
Answer: ${answer}`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}');
}