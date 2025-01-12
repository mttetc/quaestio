"use server";

import { canConnectMoreEmails } from "@/lib/core/auth/roles";
import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { encryptAccessToken } from "@/lib/infrastructure/encryption";
import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

export type EmailAccountInsert = InferInsertModel<typeof emailAccounts>;
type EmailProvider = (typeof emailAccounts.provider.enumValues)[number];

export async function addEmailAccount(
    userId: string,
    email: string,
    accessToken: string,
    provider: EmailProvider
): Promise<EmailAccountInsert> {
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
