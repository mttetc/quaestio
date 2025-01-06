import { openai } from "./config";
import { QA } from "@/lib/schemas/qa";

export interface AutoResponse {
    subject: string;
    body: string;
    confidence: number;
    suggestedFollowUp?: string;
}

export async function generateAutoResponse(question: string, similarQAs: QA[]): Promise<AutoResponse> {
    const formattedQAs = similarQAs.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n");

    const prompt = `
Generate a professional email response based on similar past Q&A exchanges.
Use the historical context to create a comprehensive and accurate response.

Current Question: ${question}

Similar Past Q&As:
${formattedQAs}

Instructions:
1. Maintain a professional and helpful tone
2. Include specific details from similar past answers
3. Be concise but thorough
4. Add a follow-up suggestion if appropriate
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "You are an email response expert. Respond only with valid JSON.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
}
