import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface QA {
  question: string;
  answer: string;
  context?: string;
  importance: 'low' | 'medium' | 'high';
  confidence: number;
  tags: string[];
  emailId: string;
  metadata: {
    subject: string;
    date: Date;
    context: string | null;
  };
}

export async function generateFAQ(qas: QA[]): Promise<string> {
  const prompt = `
    Generate a comprehensive FAQ document from these Q&A pairs:
    ${JSON.stringify(qas, null, 2)}

    Format the FAQ as markdown with:
    - Questions grouped by topic
    - Most important/confident answers first
    - Clear, concise language
    - Proper markdown headings and formatting
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that generates well-organized FAQ documents from Q&A pairs."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return completion.choices[0].message.content || '';
} 