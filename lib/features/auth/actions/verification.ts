"use server";

import { z } from "zod";
import { createClient } from "@/lib/infrastructure/supabase/server";

export const verificationResultSchema = z.object({
    verified: z.boolean(),
    shouldRedirect: z.string().nullable(),
});

export const resendVerificationResultSchema = z.object({
    success: z.boolean(),
});

export type VerificationResult = z.infer<typeof verificationResultSchema>;
export type ResendVerificationResult = z.infer<typeof resendVerificationResultSchema>;

export async function checkEmailVerification(): Promise<VerificationResult> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { verified: false, shouldRedirect: "/login" };
        }

        if (!user.email_confirmed_at) {
            return { verified: false, shouldRedirect: "/verify-email" };
        }

        return { verified: true, shouldRedirect: null };
    } catch (error) {
        return { verified: false, shouldRedirect: "/login" };
    }
}

export async function resendVerificationEmail(): Promise<ResendVerificationResult> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        throw new Error("No email found");
    }

    const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
    });

    if (error) {
        throw error;
    }

    return { success: true };
}
