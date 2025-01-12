import { z } from "zod";

export const extractFormStateSchema = z.object({
    status: z
        .object({
            count: z.number().optional(),
            error: z.string().optional(),
            failedEmails: z.number().optional(),
        })
        .optional(),
    dateRange: z
        .object({
            from: z.date(),
            to: z.date(),
        })
        .optional(),
});

export type ExtractFormState = z.infer<typeof extractFormStateSchema>;
