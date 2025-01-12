import { z } from "zod";
import { profiles } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

export type Profile = InferSelectModel<typeof profiles>;

export const userSchema = createSelectSchema(profiles).extend({
    email: z.string().email(),
    emailVerified: z.boolean(),
    subscriptionStatus: z.enum(["INACTIVE", "ACTIVE", "CANCELED"]),
    hasCompletedOnboarding: z.boolean(),
});

export type User = z.infer<typeof userSchema>;
