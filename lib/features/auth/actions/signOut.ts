"use server";

import { createClient } from "@/lib/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { type AuthResult } from "@/lib/features/auth/schemas/auth";

export async function signOut(): Promise<AuthResult> {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, error: error.message };
    }

    redirect("/login");
}
