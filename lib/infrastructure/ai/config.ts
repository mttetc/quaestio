import { OpenAI } from 'openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatModel = new ChatOpenAI({
  modelName: 'gpt-4-turbo-preview',
  temperature: 0.2,
  openAIApiKey: process.env.OPENAI_API_KEY,
});