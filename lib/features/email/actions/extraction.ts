"use server";

import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { decryptAccessToken } from "@/lib/core/encryption";
import { getEmailsByDateRange } from "@/lib/features/email/actions/imap";
import { eq } from "drizzle-orm";

export async function extractEmails(emailAccountId: string) {
    try {
        const [emailAccount] = await db
            .select()
            .from(emailAccounts)
            .where(eq(emailAccounts.id, emailAccountId))
            .limit(1);

        if (!emailAccount) {
            throw new Error("Email account not found");
        }

        const accessToken = await decryptAccessToken(
            emailAccount.encryptedAccessToken,
            emailAccount.encryptionIV,
            emailAccount.encryptionTag
        );

        if (!accessToken) {
            throw new Error("Failed to decrypt access token");
        }

        return getEmailsByDateRange(
            emailAccount.email,
            accessToken,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            new Date()
        );
    } catch (error) {
        console.error("Error extracting emails:", error);
        throw error;
    }
}
