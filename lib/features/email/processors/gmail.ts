import { z } from "zod";
import { openai } from "@/lib/infrastructure/ai/config";
import { qaEntries } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { EmailContent } from "@/lib/features/email/schemas/email";
import { createInsertSchema } from "drizzle-zod";

const emailQAPairSchema = z.object({
    question: z.string(),
    answer: z.string(),
    metadata: z.object({
        subject: z.string().optional(),
        date: z.date(),
        context: z.string().optional(),
    }),
    confidence: z.number().min(0).max(100),
    importance: z.enum(["low", "medium", "high"]),
});

export type EmailQAPair = z.infer<typeof emailQAPairSchema>;

export async function extractQAPairs(email: EmailContent): Promise<EmailQAPair[]> {
    const prompt = `Extract question and answer pairs from the following email conversation. 
Format each pair as a JSON object with "question" and "answer" fields.

Email:
Subject: ${email.subject}
Date: ${email.date}
Content:
${email.text}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an expert at identifying question and answer pairs in email conversations.",
            },
            { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
    });

    const rawPairs = JSON.parse(response.choices[0].message.content || "[]");
    if (!Array.isArray(rawPairs)) {
        throw new Error("Expected array of QA pairs");
    }

    return rawPairs.map((pair) => {
        const qaPair = {
            question: pair.question,
            answer: pair.answer,
            metadata: {
                subject: email.subject,
                date: new Date(email.date),
                context: email.text,
            },
            confidence: 90, // Default confidence for extracted pairs
            importance: "medium" as const,
        };

        const result = emailQAPairSchema.safeParse(qaPair);
        if (!result.success) {
            throw new Error(`Invalid QA pair: ${result.error.message}`);
        }
        return result.data;
    });
}
