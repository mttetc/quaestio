"use server";

import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";

export interface AuthResult {
    success: boolean;
    error?: string;
}

export async function signIn(_: unknown, formData: FormData): Promise<AuthResult> {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    redirect("/dashboard");
}

export async function signUp(_: unknown, formData: FormData): Promise<AuthResult> {
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
        if (error.message.includes("User already registered")) {
            return { success: false, error: "This email is already registered. Please sign in instead." };
        }
        return { success: false, error: error.message };
    }

    redirect("/login?verified=true");
}

export async function signOut(): Promise<AuthResult> {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, error: error.message };
    }

    redirect("/login");
}

export async function completeOnboarding(): Promise<AuthResult> {
    const supabase = await createClient();

    try {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            return { success: false, error: "Failed to fetch user" };
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({ onboarding_completed: true })
            .eq("id", user.id)
            .single();

        if (updateError) {
            return { success: false, error: "Failed to complete onboarding" };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete onboarding",
        };
    }
}
