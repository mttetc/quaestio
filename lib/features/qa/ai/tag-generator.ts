import { ai } from "@/lib/infrastructure/ai/client";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const tagResultSchema = z.object({
    tags: z.array(z.string()),
    confidence: z.number().min(0).max(100),
});

export type TagGenerationResult = z.infer<typeof tagResultSchema>;

const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a tag generation expert. Generate relevant tags for Q&A content.
Respond with JSON in this exact format:
{
    "tags": string[],
    "confidence": number (0-100)
}`
    ),
    HumanMessagePromptTemplate.fromTemplate("Generate tags for this Q&A:\nQuestion: {question}\nAnswer: {answer}"),
]);

export async function generateTags(question: string, answer: string): Promise<TagGenerationResult> {
    const messages = await prompt.formatMessages({
        question,
        answer,
    });

    const response = await ai.complete({
        messages: messages.map((m) => ({
            role: m.getType() as "system" | "user" | "assistant",
            content: m.content.toString(),
        })),
        responseFormat: "json",
    });

    return tagResultSchema.parse(JSON.parse(response));
}
