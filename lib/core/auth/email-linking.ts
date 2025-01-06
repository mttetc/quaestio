"use server";

import { emailAccounts } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { encryptAccessToken } from "@/lib/core/encryption";
import { db } from "@/lib/core/db";

export async function checkEmailLinkingStatus(userId: string) {
    const accounts = await db.query.emailAccounts.findMany({
        where: eq(emailAccounts.userId, userId),
    });

    return {
        hasLinkedEmail: accounts.length > 0,
    };
}

export async function linkEmailAccount(userId: string, email: string, accessToken: string, provider: string) {
    const { encryptedData, iv, tag } = encryptAccessToken(accessToken);

    await db.insert(emailAccounts).values({
        userId,
        email,
        encryptedAccessToken: encryptedData,
        encryptionIV: iv,
        encryptionTag: tag,
        provider,
    });

    return {
        success: true,
    };
}
