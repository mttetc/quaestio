"use server";

import { z } from "zod";
import { getEmailsByDateRange } from "../utils/imap";
import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { decryptAccessToken } from "@/lib/infrastructure/encryption";
import { eq } from "drizzle-orm";
import { extractQAPairs } from "../processors/gmail";

const extractionResultSchema = z.object({
    success: z.boolean(),
    qaPairs: z.array(z.any()),
    failedEmails: z.number(),
    error: z.string().optional(),
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;

export async function extractQAsFromEmails(
    emailAccountId: string,
    startDate: Date,
    endDate: Date
): Promise<ExtractionResult> {
    try {
        const [emailAccount] = await db
            .select()
            .from(emailAccounts)
            .where(eq(emailAccounts.id, emailAccountId))
            .limit(1);

        if (!emailAccount) {
            return { success: false, qaPairs: [], failedEmails: 0, error: "Email account not found" };
        }

        const accessToken = await decryptAccessToken(
            emailAccount.encryptedAccessToken,
            emailAccount.encryptionIV,
            emailAccount.encryptionTag
        );

        if (!accessToken) {
            return { success: false, qaPairs: [], failedEmails: 0, error: "Failed to decrypt access token" };
        }

        const emails = await getEmailsByDateRange(emailAccount.email, accessToken, startDate, endDate);
        const allQAs = [];
        let failedEmails = 0;

        for (const email of emails) {
            try {
                const qaPairs = await extractQAPairs(email);
                allQAs.push(...qaPairs);
            } catch (error) {
                console.error("Failed to process email:", error);
                failedEmails++;
            }
        }

        const result = extractionResultSchema.parse({
            success: true,
            qaPairs: allQAs,
            failedEmails,
        });

        return result;
    } catch (error) {
        console.error("Error extracting QAs:", error);
        return {
            success: false,
            qaPairs: [],
            failedEmails: 0,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}
