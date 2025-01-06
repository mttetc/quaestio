"use server";

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

interface Email {
    id: string;
    subject: string;
    text: string;
    date: Date;
}

export async function getEmailsByDateRange(
    email: string,
    accessToken: string,
    startDate: Date,
    endDate: Date
): Promise<Email[]> {
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
            const messages = [];
            for await (const message of client.fetch(
                {
                    since: startDate,
                    before: endDate,
                },
                {
                    source: true,
                    uid: true,
                }
            )) {
                const parsed = await simpleParser(message.source);
                messages.push({
                    id: message.uid.toString(),
                    subject: parsed.subject || "",
                    text: parsed.text || "",
                    date: parsed.date || new Date(),
                });
            }
            return messages;
        } finally {
            lock.release();
        }
    } finally {
        await client.logout();
    }
}
