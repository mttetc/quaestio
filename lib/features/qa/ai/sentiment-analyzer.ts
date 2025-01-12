import { ai } from "@/lib/infrastructure/ai/client";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { sentimentAnalysisSchema } from "../schemas/sentiment";
import { z } from "zod";

export type SentimentAnalysis = z.infer<typeof sentimentAnalysisSchema>;

interface SentimentPromptVariables {
    question: string;
    answer: string;
}

const prompt = ChatPromptTemplate.fromMessages<SentimentPromptVariables>([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a sentiment analysis expert. Analyze the sentiment and helpfulness of Q&A pairs.
Respond with JSON in this exact format:
{
    "sentiment": "positive" | "negative" | "neutral",
    "score": number (-1 to 1),
    "keywords": string[],
    "confidence": number (0-100)
}`
    ),
    HumanMessagePromptTemplate.fromTemplate("Analyze this Q&A pair:\nQuestion: {question}\nAnswer: {answer}"),
]);

export async function analyzeSentiment(question: string, answer: string): Promise<SentimentAnalysis> {
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

    return sentimentAnalysisSchema.parse(JSON.parse(response));
}
