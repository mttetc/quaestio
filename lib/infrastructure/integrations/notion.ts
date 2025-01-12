import { qaEntries } from "@/lib/core/db/schema";
import { Client } from "@notionhq/client";
import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { InferSelectModel } from "drizzle-orm";

export async function syncToNotion(apiKey: string, databaseId: string, data: InferSelectModel<typeof qaEntries>[]) {
    const notion = new Client({ auth: apiKey });

    const pages = data.map((qa) => {
        const page: CreatePageParameters = {
            parent: { database_id: databaseId },
            properties: {
                Question: {
                    type: "title",
                    title: [{ type: "text", text: { content: qa.question } }],
                },
                Answer: {
                    type: "rich_text",
                    rich_text: [{ type: "text", text: { content: qa.answer } }],
                },
                Category: {
                    type: "select",
                    select: { name: qa.metadata?.category || "Uncategorized" },
                },
                Tags: {
                    type: "multi_select",
                    multi_select: (qa.tags ?? []).map((tag) => ({ name: tag })),
                },
                Confidence: {
                    type: "number",
                    number: qa.confidence,
                },
                Date: {
                    type: "date",
                    date: { start: (qa.metadata?.date || new Date()).toISOString() },
                },
            },
        };
        return page;
    });

    // Create pages in batches to respect API limits
    const batchSize = 10;
    const results: { success: boolean; error?: string }[] = [];

    for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(batch.map((page) => notion.pages.create(page)));

        results.push(
            ...batchResults.map((result) => {
                if (result.status === "rejected") {
                    console.error("Failed to create Notion page:", result.reason);
                    return {
                        success: false,
                        error: result.reason instanceof Error ? result.reason.message : "Failed to create page",
                    };
                }
                return { success: true };
            })
        );

        // Rate limiting pause between batches
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const failedCount = results.filter((r) => !r.success).length;
    if (failedCount > 0) {
        console.error(`Failed to sync ${failedCount} out of ${pages.length} pages to Notion`);
    }

    return results;
}
