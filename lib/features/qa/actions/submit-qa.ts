"use server";

import { z } from "zod";
import { createQA } from "./create-qa";
import { updateQA } from "./update-qa";
import { qaEntries, type QAMetadata } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { createQAInputSchema, type QAFieldErrors } from "@/lib/features/qa/schemas/qa";

export const formStateSchema = z.object({
    error: z.string().optional(),
    message: z.string().optional(),
    fieldErrors: z.record(z.string(), z.array(z.string())).default({}),
});

export type FormState = z.infer<typeof formStateSchema>;

export async function submitQA(
    qa: InferSelectModel<typeof qaEntries> | undefined,
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        const metadata: QAMetadata = {
            date: new Date(),
            subject: formData.get("subject")?.toString(),
            category: formData.get("category")?.toString(),
            context: formData.get("context")?.toString() ?? null,
        };

        const rawData = {
            emailId: formData.get("emailId")?.toString() ?? null,
            question: formData.get("question")?.toString() ?? "",
            answer: formData.get("answer")?.toString() ?? "",
            importance: formData.get("importance")?.toString() ?? "medium",
            confidence: Number(formData.get("confidence")) || 100,
            tags:
                formData
                    .get("tags")
                    ?.toString()
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean) ?? null,
            category: formData.get("category")?.toString() ?? null,
            metadata,
            responseTimeHours: null,
        };

        const result = createQAInputSchema.safeParse(rawData);
        if (!result.success) {
            return {
                error: "Invalid form data",
                fieldErrors: result.error.formErrors.fieldErrors,
            };
        }

        if (qa) {
            await updateQA(qa.id, result.data);
        } else {
            await createQA(result.data);
        }

        return { message: `Q&A ${qa ? "updated" : "created"} successfully`, fieldErrors: {} };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to save Q&A",
            fieldErrors: {},
        };
    }
}
