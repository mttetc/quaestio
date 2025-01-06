import { ImapFlow, ImapFlowOptions } from "imapflow";
import { simpleParser } from "mailparser";
import { decryptPassword } from "../encryption";

export interface Email {
    id: string;
    subject: string;
    from: string;
    to: string;
    date: Date;
    text: string;
    html?: string;
}

const DEFAULT_CONFIG = {
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    logger: false as const,
    emitLogs: false,
    tls: {
        rejectUnauthorized: true,
        servername: "imap.gmail.com",
    },
} as const;

export async function createImapConnection(password: string, email: string, isEncrypted = false) {
    let finalPassword = password;

    if (isEncrypted) {
        try {
            finalPassword = decryptPassword(password);
        } catch (error) {
            console.error("Failed to decrypt password:", error);
            throw new Error("Invalid password format");
        }
    }

    const config: ImapFlowOptions = {
        ...DEFAULT_CONFIG,
        auth: {
            user: email,
            pass: finalPassword,
        },
    };

    return new ImapFlow(config);
}

export async function testConnection(client: ImapFlow): Promise<boolean> {
    try {
        await client.connect();
        await client.list();
        return true;
    } catch (error) {
        console.error("IMAP connection test failed:", error);
        return false;
    } finally {
        try {
            await client.logout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
}

export async function getEmailsByDateRange(
    email: string,
    password: string,
    startDate: Date,
    endDate: Date
): Promise<Email[]> {
    const config: ImapFlowOptions = {
        ...DEFAULT_CONFIG,
        auth: {
            user: email,
            pass: password,
        },
    };
    const client = new ImapFlow(config);

    try {
        await client.connect();
        const lock = await client.getMailboxLock("INBOX");

        try {
            const results: Email[] = [];
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
                results.push({
                    id: message.uid.toString(),
                    subject: parsed.subject || "",
                    from: parsed.from?.text || "",
                    to: Array.isArray(parsed.to) ? parsed.to.map((t) => t.text).join(", ") : parsed.to?.text || "",
                    date: parsed.date || new Date(),
                    text: parsed.text || "",
                    html: parsed.html || undefined,
                });
            }
            return results;
        } finally {
            lock.release();
        }
    } finally {
        try {
            await client.logout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
}
