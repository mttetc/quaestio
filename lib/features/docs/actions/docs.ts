"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { eq, inArray } from "drizzle-orm";
import { openai } from "@/lib/infrastructure/ai/config";

interface DocsState {
    error?: string;
    success?: boolean;
    preview?: string;
    title: string;
    description: string;
    selectedQAs: string[];
}

export async function generateDocs(prevState: DocsState, formData: FormData): Promise<DocsState> {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const selectedQAs = formData.getAll("selectedQAs") as string[];

        if (!selectedQAs.length) {
            return {
                ...prevState,
                error: "Please select at least one Q&A to generate documentation",
            };
        }

        const entries = await db.query.qaEntries.findMany({
            where: inArray(qaEntries.id, selectedQAs),
        });

        const prompt = `
      Generate comprehensive documentation from these Q&A pairs:
      ${JSON.stringify(entries, null, 2)}

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

        const preview = completion.choices[0].message.content || "";

        return {
            title,
            description,
            selectedQAs,
            preview,
            success: true,
        };
    } catch (error) {
        return {
            ...prevState,
            error: error instanceof Error ? error.message : "Failed to generate documentation",
        };
    }
}
