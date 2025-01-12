import { z } from "zod";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export const emailContentSchema = z.object({
    id: z.string(),
    subject: z.string(),
    date: z.date(),
    from: z.string().email(),
    to: z.string().email(),
    text: z.string(),
    html: z.string(),
});

export type EmailContent = z.infer<typeof emailContentSchema>;

export const emailConnectionSchema = z.object({
    provider: z.enum(emailAccounts.provider.enumValues),
    email: z.string().email(),
    accessToken: z.string(),
});

export type EmailConnection = z.infer<typeof emailConnectionSchema>;

export const emailErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
});

export type EmailError = z.infer<typeof emailErrorSchema>;
