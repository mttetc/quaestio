import { ai } from "@/lib/infrastructure/ai/client";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { contentAnalysisSchema, type ContentAnalysis } from "../schemas/content";

const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a content comparison expert. Compare two pieces of content and provide analysis.
Respond with JSON in this exact format:
{
    "similarity": number (0-1),
    "differences": string[],
    "suggestions": string[]
}`
    ),
    HumanMessagePromptTemplate.fromTemplate("Compare these contents:\nContent 1: {content1}\nContent 2: {content2}"),
]);

export async function compareContent(content1: string, content2: string): Promise<ContentAnalysis> {
    const messages = await prompt.formatMessages({
        content1,
        content2,
    });

    const response = await ai.complete({
        messages: messages.map((m) => ({
            role: m.getType() as "system" | "user" | "assistant",
            content: m.content.toString(),
        })),
        responseFormat: "json",
    });

    return contentAnalysisSchema.parse(JSON.parse(response));
}
