"use server";

import { z } from "zod";
import { addEmailAccount } from "@/lib/features/email/actions/add-account";
import { emailAccounts } from "@/lib/core/db/schema";

type EmailProvider = (typeof emailAccounts.provider.enumValues)[number];

export const connectEmailInputSchema = z.object({
    email: z.string().email(),
    appPassword: z.string().min(1, "App password is required"),
    provider: z.enum(emailAccounts.provider.enumValues),
    userId: z.string().min(1, "User ID is required"),
});

export const connectEmailResultSchema = z.object({
    error: z.string().optional(),
    success: z.boolean().optional(),
});

export type ConnectEmailResult = z.infer<typeof connectEmailResultSchema>;

export async function connectEmail(prevState: ConnectEmailResult, formData: FormData): Promise<ConnectEmailResult> {
    try {
        const rawData = {
            email: formData.get("email")?.toString() ?? "",
            appPassword: formData.get("appPassword")?.toString() ?? "",
            provider: "gmail" as const,
            userId: formData.get("userId")?.toString() ?? "",
        };

        const result = connectEmailInputSchema.safeParse(rawData);
        if (!result.success) {
            return { error: "Invalid form data" };
        }

        await addEmailAccount(result.data.userId, result.data.email, result.data.appPassword, result.data.provider);
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Failed to connect email account" };
    }
}
