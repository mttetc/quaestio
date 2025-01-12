import { qaEntries } from "@/lib/core/db/schema";
import { openai } from "@/lib/infrastructure/ai/config";
import { InferSelectModel } from "drizzle-orm";

export async function generateDocsFromQA(
    qas: InferSelectModel<typeof qaEntries>[],
    title: string,
    description: string
): Promise<string> {
    const prompt = `
      Generate comprehensive documentation from these Q&A pairs:
      ${JSON.stringify(qas, null, 2)}

      Use this title: ${title}
      And this description: ${description}

      Format the documentation as markdown with:
      - Clear section headings based on categories/tags
      - Most important information first
      - Proper context and explanations
      - Code examples and references where relevant
      - Clear, concise language
      - Proper markdown formatting
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content:
                    "You are a technical documentation expert that creates clear, well-structured documentation from Q&A content.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return completion.choices[0].message.content || "";
}
