"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { scrapeWebsite } from "@/lib/infrastructure/integrations/web-scraper";
import { compareContent } from "../ai/content-comparison";
import { ContentAnalysis } from "../schemas/content";
import { eq } from "drizzle-orm";

export interface WebsiteAnalysisState {
    error?: string;
    analysis?: ContentAnalysis;
}

export async function analyzeWebsite(_: WebsiteAnalysisState, formData: FormData): Promise<WebsiteAnalysisState> {
    try {
        const user = await readUser();
        if (!user) throw new Error("Not authenticated");

        const url = formData.get("url") as string;
        if (!url) throw new Error("URL is required");

        // Scrape website content
        const website = await scrapeWebsite(url);

        // Get user's QA entries
        const entries = await db.select().from(qaEntries).where(eq(qaEntries.userId, user.id));
        const qaContent = entries.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n");

        // Compare website content with QA content
        const analysis = await compareContent(website.content, qaContent);
        return { analysis };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to analyze website",
        };
    }
}
