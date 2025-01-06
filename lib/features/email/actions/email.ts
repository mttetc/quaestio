"use server";

import { canConnectMoreEmails } from "@/lib/core/auth/roles";
import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { encryptAccessToken } from "@/lib/core/encryption";
import { EmailAccount } from "@/lib/schemas/email";
import { and, eq } from "drizzle-orm";

export async function getEmailAccounts(userId: string): Promise<EmailAccount[]> {
    const accounts = await db.query.emailAccounts.findMany({
        where: eq(emailAccounts.userId, userId),
    });

    return accounts;
}

export async function addEmailAccount(
    userId: string,
    email: string,
    accessToken: string,
    provider: string
): Promise<EmailAccount> {
    const canConnect = await canConnectMoreEmails(userId);
    if (!canConnect) {
        throw new Error("Cannot connect more email accounts with current plan");
    }

    const existingAccount = await db.query.emailAccounts.findFirst({
        where: eq(emailAccounts.email, email),
    });

    if (existingAccount) {
        throw new Error("Email account already exists");
    }

    const { encryptedData, iv, tag } = encryptAccessToken(accessToken);

    const [account] = await db
        .insert(emailAccounts)
        .values({
            userId,
            email,
            encryptedAccessToken: encryptedData,
            encryptionIV: iv,
            encryptionTag: tag,
            provider,
        })
        .returning();

    return account;
}

export async function removeEmailAccount(accountId: string, userId: string): Promise<void> {
    await db.delete(emailAccounts).where(and(eq(emailAccounts.id, accountId), eq(emailAccounts.userId, userId)));
}

export async function getEmailAccount(id: string, userId: string): Promise<EmailAccount> {
    const account = await db.query.emailAccounts.findFirst({
        where: and(eq(emailAccounts.id, id), eq(emailAccounts.userId, userId)),
    });

    if (!account) {
        throw new Error("Email account not found");
    }

    return account;
}

export async function refreshAccessToken(id: string, userId: string, newAccessToken: string): Promise<EmailAccount> {
    const { encryptedData, iv, tag } = encryptAccessToken(newAccessToken);

    const [account] = await db
        .update(emailAccounts)
        .set({
            encryptedAccessToken: encryptedData,
            encryptionIV: iv,
            encryptionTag: tag,
            updatedAt: new Date(),
        })
        .where(and(eq(emailAccounts.id, id), eq(emailAccounts.userId, userId)))
        .returning();

    if (!account) {
        throw new Error("Failed to update access token");
    }

    return account;
}

export interface EmailFormState {
    error?: string;
    success?: boolean;
}

export async function connectEmail(prevState: EmailFormState, formData: FormData): Promise<EmailFormState> {
    const email = formData.get("email") as string;
    const appPassword = formData.get("appPassword") as string;
    const userId = formData.get("userId") as string;

    try {
        await addEmailAccount(userId, email, appPassword, "gmail");
        return { success: true };
    } catch (error) {
        console.error("Failed to connect email:", error);
        return {
            error: error instanceof Error ? error.message : "Failed to connect email account",
        };
    }
}
