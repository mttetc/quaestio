"use server";

import { createClient } from "@/lib/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { signUpSchema, type AuthResult } from "@/lib/features/auth/schemas/auth";
import { getURL } from "@/lib/infrastructure/supabase/client";

export async function signUp(_: unknown, formData: FormData): Promise<AuthResult> {
    const supabase = await createClient();

    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };

    const result = signUpSchema.safeParse(rawData);
    if (!result.success) {
        return { success: false, error: result.error.errors[0].message };
    }

    const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
            emailRedirectTo: `${getURL()}auth/callback`,
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
