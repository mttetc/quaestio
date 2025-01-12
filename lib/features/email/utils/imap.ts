import { ImapFlow } from "imapflow";
import { EmailContent } from "@/lib/features/email/schemas/email";
import { extractEmailContent } from "./extraction";

export async function getEmailsByDateRange(
    email: string,
    accessToken: string,
    startDate: Date,
    endDate: Date
): Promise<EmailContent[]> {
    const client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: email,
            accessToken,
        },
        logger: false,
    });

    try {
        await client.connect();
        const lock = await client.getMailboxLock("INBOX");

        try {
            const results: EmailContent[] = [];
            const searchCriteria = {
                since: startDate,
                before: endDate,
            };

            for await (const message of client.fetch(searchCriteria, { source: true })) {
                try {
                    const content = await extractEmailContent(message.source);
                    if (content) {
                        results.push(content);
                    }
                } catch (error) {
                    console.error("Failed to process email:", error);
                }
            }

            return results;
        } finally {
            lock.release();
        }
    } finally {
        await client.logout();
    }
}
