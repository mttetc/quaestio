"use server";

import { z } from "zod";
import { createQA } from "./create-qa";
import { qaEntries, type QAMetadata } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

const qaDataSchema = z.object({
    emailId: z.string().nullable(),
    question: z.string(),
    answer: z.string(),
    importance: z.enum(["low", "medium", "high"]),
    confidence: z.number(),
    tags: z.array(z.string()).nullable(),
    category: z.string().nullable(),
    metadata: z.custom<QAMetadata>().nullable(),
    responseTimeHours: z.number().nullable(),
});

export type QAData = z.infer<typeof qaDataSchema>;

export async function extractQA(
    emailId: string,
    question: string,
    answer: string,
    dateRange: string,
    metadata?: Omit<QAMetadata, "date"> & { date?: never }
): Promise<InferSelectModel<typeof qaEntries>> {
    const { from, to } = JSON.parse(dateRange);
    const responseTimeHours = Math.round((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60));

    const qaData = {
        emailId,
        question,
        answer,
        importance: "medium" as const,
        confidence: 100,
        tags: null,
        category: null,
        responseTimeHours,
        metadata: metadata
            ? {
                  date: new Date(from),
                  ...metadata,
              }
            : null,
    } satisfies QAData;

    const result = qaDataSchema.safeParse(qaData);
    if (!result.success) {
        throw new Error(`Invalid QA data: ${result.error.message}`);
    }

    return createQA(result.data);
}
