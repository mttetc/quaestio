import { subscriptions } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Subscription = InferSelectModel<typeof subscriptions>;

export const subscriptionSchema = createInsertSchema(subscriptions, {
    status: z.enum(["INACTIVE", "ACTIVE", "CANCELED"]).default("INACTIVE"),
    stripeCustomerId: z.string().nullable(),
    stripePriceId: z.string().nullable(),
    stripeSubscriptionId: z.string().nullable(),
});
