import { z } from "zod";
import { emailSubscriptions } from "@/lib/core/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";

export type EmailSubscription = InferSelectModel<typeof emailSubscriptions>;

export const subscriptionStatusSchema = z.enum(["pending", "completed", "failed"]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const unsubscribeResultSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    status: subscriptionStatusSchema,
    error: z.string().optional(),
    subscription: z.union([createSelectSchema(emailSubscriptions), z.null()]),
});

export type UnsubscribeResult = z.infer<typeof unsubscribeResultSchema>;
