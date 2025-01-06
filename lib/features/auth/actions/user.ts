"use server";

import { createClient } from "@/services/supabase/server";
import type { User } from "@/lib/schemas/user";

export async function getUser(): Promise<User> {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Failed to fetch user");
    }

    return {
        id: user.id,
        email: user.email!,
        emailVerified: user.email_confirmed_at !== null,
        createdAt: user.created_at,
        updatedAt: user.last_sign_in_at ?? null,
    };
}

export async function updateUser(data: Partial<User>): Promise<User> {
    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Failed to fetch user");
    }

    const { error: updateError } = await supabase.from("users").update(data).eq("id", user.id).single();

    if (updateError) {
        throw new Error("Failed to update user");
    }

    return {
        id: user.id,
        email: user.email!,
        emailVerified: user.email_confirmed_at !== null,
        createdAt: user.created_at,
        updatedAt: user.last_sign_in_at ?? null,
        ...data,
    };
}
