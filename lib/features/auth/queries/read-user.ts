"use server";

import { db } from "@/lib/core/db";
import { profiles, subscriptions } from "@/lib/core/db/schema";
import { createClient } from "@/lib/infrastructure/supabase/server";
import { eq } from "drizzle-orm";
import { User } from "../schemas/user";

export async function readUser(): Promise<User> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id),
    });

    if (!profile) {
        throw new Error("Profile not found");
    }

    const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, user.id),
    });

    return {
        id: user.id,
        email: user.email!,
        emailVerified: user.email_confirmed_at !== null,
        availableTokens: profile.availableTokens,
        monthlyUsage: profile.monthlyUsage,
        lastUsageReset: profile.lastUsageReset,
        stripeCustomerId: profile.stripeCustomerId,
        subscriptionTier: profile.subscriptionTier,
        subscriptionStatus: (subscription?.status ?? "INACTIVE") as "INACTIVE" | "ACTIVE" | "CANCELED",
        role: profile.role,
        hasCompletedOnboarding: profile.hasCompletedOnboarding,
        currency: profile.currency,
    };
}
