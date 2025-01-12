"use server";

import { createClient } from "@/lib/infrastructure/supabase/server";

export async function completeOnboarding() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Not authenticated");
    }

    // No need to do anything - we use Supabase's email verification
    return { success: true };
}
