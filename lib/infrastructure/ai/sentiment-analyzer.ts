import { chatModel } from './config';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentAnalysis {
  sentiment: Sentiment;
  score: number;
  keywords: string[];
  confidence: number;
}

const prompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    'You are a sentiment analysis expert. Respond only with valid JSON.'
  ),
  HumanMessagePromptTemplate.fromTemplate(
    'Analyze the sentiment of this Q&A exchange:\nQuestion: {question}\nAnswer: {answer}'
  )
]);

export async function analyzeSentiment(
  question: string,
  answer: string
): Promise<SentimentAnalysis> {
  const messages = await prompt.formatMessages({
    question,
    answer
  });

  const response = await chatModel.invoke(messages);
  const result = JSON.parse(response.text) as SentimentAnalysis;
  return result;
}