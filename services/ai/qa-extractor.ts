import OpenAI from "openai";
import { Email } from "@/lib/shared/schemas/email";
import { QAMetadata } from "@/lib/core/db/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QA {
  emailId: string;
  question: string;
  answer: string;
  context?: string;
  importance: "low" | "medium" | "high";
  confidence: number;
  tags: string[];
  metadata: QAMetadata;
}

export async function extractQAFromEmail(email: Email): Promise<QA[]> {
  const prompt = `
    Extract question and answer pairs from the following email content.
    For each Q&A pair, also:
    - Rate its importance (low, medium, high)
    - Assign a confidence score (0-1)
    - Add relevant tags
    - Include relevant context if available

    Email Subject: ${email.subject}
    Email Content:
    ${email.text}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that extracts Q&A pairs from emails. Format your response as JSON with the following structure for each Q&A pair: { question: string, answer: string, importance: 'low' | 'medium' | 'high', confidence: number, tags: string[], context?: string }",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const response = JSON.parse(completion.choices[0].message.content || '{"pairs": []}');

  return response.pairs.map((pair: any) => ({
    emailId: email.id,
    question: pair.question,
    answer: pair.answer,
    context: pair.context,
    importance: pair.importance || "medium",
    confidence: pair.confidence || 0.5,
    tags: pair.tags || [],
    metadata: {
      subject: email.subject,
      date: email.date,
      context: pair.context || null,
    },
  }));
} 