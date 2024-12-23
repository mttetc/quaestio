import { openai } from './config';

export async function generateTags(
  question: string, 
  answer: string
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Generate 1-3 concise tags that categorize this Q&A. Return only valid JSON array of strings.'
      },
      {
        role: 'user',
        content: `Generate relevant tags for this Q&A:
Question: ${question}
Answer: ${answer}

Instructions:
1. Tags should be concise (1-2 words)
2. Tags should reflect the main topic/domain
3. Tags should be consistent and reusable
4. Avoid overly specific or unique tags
5. Use lowercase with hyphens for spaces

Example tags: technical-issue, billing, feature-request, bug-report, documentation`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}').tags || ['uncategorized'];
}