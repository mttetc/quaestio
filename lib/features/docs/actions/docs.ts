"use server";

import { z } from "zod";
import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { inArray } from "drizzle-orm";
import { generateDocsFromQA } from "@/lib/features/docs/ai/docs-generator";

export const docsStateSchema = z.object({
    error: z.string().optional(),
    success: z.boolean().optional(),
    preview: z.string().optional(),
    title: z.string(),
    description: z.string(),
    selectedQAs: z.array(z.string()),
});

export type DocsState = z.infer<typeof docsStateSchema>;

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

        const preview = await generateDocsFromQA(entries, title, description);

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
