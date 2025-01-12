"use server";

import { db } from "@/lib/core/db";
import { profiles } from "@/lib/core/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

const profileSchema = createSelectSchema(profiles);

export async function readTokenBalance(userId: string) {
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    if (!profile) {
        throw new Error("User profile not found");
    }

    const result = profileSchema.safeParse(profile);
    if (!result.success) {
        throw new Error(`Invalid profile data: ${result.error.message}`);
    }

    return {
        available: result.data.availableTokens,
        used: result.data.monthlyUsage,
        total: result.data.availableTokens + result.data.monthlyUsage,
    };
}
