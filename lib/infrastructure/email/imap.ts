import { ImapFlow } from "imapflow";
import type { FetchMessageObject, ImapFlowOptions } from "imapflow";
import { simpleParser, ParsedMail } from "mailparser";

export type ImapConfig = {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
};

type ImapFlowConfig = Omit<ImapFlowOptions, "auth"> & {
    auth: {
        user: string;
        pass: string;
    };
};

export async function createImapClient(config: ImapConfig): Promise<ImapFlow> {
    const imapConfig: ImapFlowConfig = {
        host: config.host,
        port: config.port,
        secure: config.tls,
        auth: {
            user: config.user,
            pass: config.password,
        },
        logger: false,
    };

    const client = new ImapFlow(imapConfig);
    await client.connect();
    return client;
}

export async function fetchUnreadEmails(client: ImapFlow): Promise<ParsedMail[]> {
    const messages: ParsedMail[] = [];

    await client.mailboxOpen("INBOX");

    let message: FetchMessageObject;
    for await (message of client.fetch("UNSEEN", { source: true })) {
        const parsed = await simpleParser(message.source);
        messages.push(parsed);
    }

    return messages;
}
