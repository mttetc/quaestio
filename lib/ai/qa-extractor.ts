import { openai } from './config';

export interface QAPair {
  question: string;
  answer: string;
  confidence: number;
  context?: string;
  importance: 'high' | 'medium' | 'low';
  tags?: string[];
}

export async function extractQAPairs(
  emailContent: string
): Promise<QAPair[]> {
  const prompt = `
    You are an expert at identifying questions and answers in email conversations.
    Analyze the following email content and extract any questions and their corresponding answers.
    Only extract Q&As that are meaningful and provide valuable information.

    Email Content:
    ${emailContent}

    Instructions:
    1. Identify clear questions and their direct answers
    2. Ensure the extracted Q&As are self-contained and make sense without additional context
    3. Skip rhetorical questions or non-informative exchanges
    4. Maintain the original meaning and context
    5. If a question has no clear answer in the text, skip it
    6. Identify the importance level of each Q&A (high, medium, low) based on:
       - Urgency of the question
       - Impact of the answer
       - Frequency of similar questions in the context
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a Q&A extraction expert. Respond only with valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}').pairs;
}