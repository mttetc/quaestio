"use server";

import { db } from "@/lib/core/db";
import { profiles, subscriptions } from "@/lib/core/db/schema";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { createUpdateSchema } from "drizzle-zod";
import type { User } from "../schemas/user";
import type { Subscription } from "../schemas/subscription";
import { eq } from "drizzle-orm";

const updateProfileSchema = createUpdateSchema(profiles);

export async function updateUser(data: Partial<User>): Promise<User> {
    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Failed to fetch user");
    }

    // Only update business fields in our database
    const { id, email, emailVerified, subscriptionStatus, ...updateData } = data;

    const result = updateProfileSchema.safeParse(updateData);
    if (!result.success) {
        throw new Error(`Invalid update data: ${result.error.message}`);
    }

    const [updatedProfile] = await db.update(profiles).set(result.data).where(eq(profiles.id, user.id)).returning();

    if (!updatedProfile) {
        throw new Error("Failed to update user");
    }

    const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, user.id),
    });

    const status = subscription?.status ?? "INACTIVE";
    if (status !== "INACTIVE" && status !== "ACTIVE" && status !== "CANCELED") {
        throw new Error("Invalid subscription status");
    }

    return {
        ...updatedProfile,
        email: user.email!,
        emailVerified: user.email_confirmed_at !== null,
        subscriptionStatus: status,
    };
}
