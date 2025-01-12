import { z } from "zod";
import { qaEntries } from "@/lib/core/db/schema";
import { createInsertSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";

export const qaFilterSchema = z.object({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    importance: z.enum(["low", "medium", "high"]).optional(),
    confidence: z
        .object({
            min: z.number().optional(),
            max: z.number().optional(),
        })
        .optional(),
    dateRange: z
        .object({
            start: z.date().optional(),
            end: z.date().optional(),
        })
        .optional(),
    limit: z.number().int().min(1).optional(),
});

export type QAFilter = z.infer<typeof qaFilterSchema>;
export type QAEntry = InferSelectModel<typeof qaEntries>;

export const createQAInputSchema = createInsertSchema(qaEntries, {
    emailId: z.string().nullable(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    importance: z.enum(["low", "medium", "high"]).default("medium"),
    confidence: z.number().min(0).max(100).default(100),
    tags: z.array(z.string()).nullable().default(null),
    category: z.string().nullable(),
    responseTimeHours: z.number().nullable(),
    metadata: z
        .object({
            date: z.date(),
            subject: z.string().optional(),
            category: z.string().optional(),
            context: z.string().nullable(),
        })
        .nullable(),
});

export type CreateQAInput = z.infer<typeof createQAInputSchema>;

export type QAFieldErrors = {
    [K in keyof typeof createQAInputSchema._type]?: string[];
} & {
    "metadata.subject"?: string[];
    "metadata.context"?: string[];
};
