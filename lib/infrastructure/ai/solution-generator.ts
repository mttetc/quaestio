import { openai } from './config';

export interface Solution {
  title: string;
  description: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  preventiveMeasures: string[];
}

export interface SolutionResponse {
  problem: string;
  solutions: Solution[];
}

export async function generateSolutions(
  question: string,
  answer: string,
  context: string,
  tags: string[],
  importance: string
): Promise<SolutionResponse> {
  const prompt = `Analyze this Q&A and generate solutions:
Question: ${question}
Answer: ${answer}
Context: ${context}
Tags: ${tags.join(', ')}
Importance: ${importance}

Generate 2-3 practical solutions with:
- Clear problem statement
- Detailed solution descriptions
- Step-by-step implementation
- Difficulty level
- Time estimates
- Preventive measures`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert problem solver. Respond only with valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}');
}