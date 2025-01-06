import * as z from "zod";
import { emailAccounts } from "@/lib/core/db/schema";
import { InferModel } from "drizzle-orm";

export const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export const emailConnectionSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    appPassword: z
        .string()
        .min(16, "App Password must be at least 16 characters")
        .max(32, "App Password must be at most 32 characters"),
});

export const emailContentSchema = z.object({
    id: z.string(),
    subject: z.string(),
    from: z.string(),
    to: z.string(),
    date: z.date(),
    text: z.string(),
    html: z.string().optional(),
});

export const emailSubscriptionSchema = z.object({
    sender: z.string(),
    domain: z.string(),
    type: z.enum(["newsletter", "marketing", "updates", "social", "other"]),
    unsubscribeMethod: z.enum(["link", "email", "form", "unknown"]),
    unsubscribeData: z.object({
        link: z.string().optional(),
        email: z.string().optional(),
        formUrl: z.string().optional(),
    }),
    status: z.enum(["active", "unsubscribed", "pending"]),
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type Email = z.infer<typeof emailContentSchema>;
export type EmailSubscription = z.infer<typeof emailSubscriptionSchema>;

export interface EmailSearchParams {
    startDate: Date;
    endDate: Date;
    emailAccountId: string;
}

export interface UnsubscribeResult {
    success: boolean;
    status: "completed" | "pending" | "failed";
    error?: string;
    message: string;
}

export type EmailAccount = InferModel<typeof emailAccounts>;
export type NewEmailAccount = InferModel<typeof emailAccounts, "insert">;
