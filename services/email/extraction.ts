import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { decryptAccessToken } from "@/lib/core/encryption";
import { getEmailsByDateRange } from "@/lib/features/email/actions/imap";
import { extractQAPairs } from "@/lib/infrastructure/ai/qa-extractor";
import { CreateQAInput } from "@/lib/schemas/qa";

export async function extractQAsFromEmails(
    emailAccountId: string,
    startDate: Date,
    endDate: Date
): Promise<CreateQAInput[]> {
    // Get user's email account
    const [emailAccount] = await db.select().from(emailAccounts).where(eq(emailAccounts.id, emailAccountId)).limit(1);

    if (!emailAccount) {
        throw new Error("No email account found");
    }

    // Get emails for the date range
    const accessToken = await decryptAccessToken(
        emailAccount.encryptedAccessToken,
        emailAccount.encryptionIV,
        emailAccount.encryptionTag
    );
    const emails = await getEmailsByDateRange(emailAccount.email, accessToken, startDate, endDate);

    const qas: CreateQAInput[] = [];

    for (const email of emails) {
        const extractedQAData = await extractQAPairs(email.text);
        if (!extractedQAData) continue;

        for (const qaData of extractedQAData) {
            qas.push({
                ...qaData,
                tags: qaData.tags || [],
                metadata: {
                    date: email.date,
                    subject: email.subject,
                    context: qaData.context || null,
                },
            });
        }
    }

    return qas;
}
