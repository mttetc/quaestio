"use server";

import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";

export interface AuthState {
    error?: string;
    success?: boolean;
}

export async function signIn(_: unknown, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    redirect("/dashboard");
}

export async function signUp(_: unknown, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        throw error;
    }

    redirect("/login?verified=true");
}

export async function signOut() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true };
}

export async function completeOnboarding(): Promise<AuthState> {
    const supabase = await createClient();

    try {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("Failed to fetch user");

        const { error: updateError } = await supabase
            .from("users")
            .update({ onboarding_completed: true })
            .eq("id", user.id)
            .single();

        if (updateError) throw new Error("Failed to complete onboarding");

        return { success: true };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to complete onboarding",
        };
    }
}
