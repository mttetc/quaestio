import { simpleParser } from "mailparser";
import { emailContentSchema, type EmailContent } from "@/lib/features/email/schemas/email";

export async function extractEmailContent(source: Buffer): Promise<EmailContent | null> {
    try {
        const parsed = await simpleParser(source);

        const rawContent = {
            id: parsed.messageId || crypto.randomUUID(),
            subject: parsed.subject || "",
            from: Array.isArray(parsed.from) ? parsed.from.map((f) => f.text).join(", ") : parsed.from?.text || "",
            to: Array.isArray(parsed.to) ? parsed.to.map((t) => t.text).join(", ") : parsed.to?.text || "",
            text: parsed.text || "",
            html: parsed.html || "",
            date: parsed.date || new Date(),
        };

        const result = emailContentSchema.safeParse(rawContent);
        if (!result.success) {
            console.error("Failed to validate email content:", result.error);
            return null;
        }

        return result.data;
    } catch (error) {
        console.error("Failed to parse email:", error);
        return null;
    }
}
