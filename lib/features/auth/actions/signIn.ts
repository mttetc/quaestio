"use server";

import { createClient } from "@/lib/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { signInSchema, type AuthResult } from "@/lib/features/auth/schemas/auth";

export async function signIn(_: unknown, formData: FormData): Promise<AuthResult> {
    const supabase = await createClient();

    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const result = signInSchema.safeParse(rawData);
    if (!result.success) {
        return { success: false, error: result.error.errors[0].message };
    }

    const { error } = await supabase.auth.signInWithPassword(result.data);

    if (error) {
        return { success: false, error: error.message };
    }

    redirect("/dashboard");
}
