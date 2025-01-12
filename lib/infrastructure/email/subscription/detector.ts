import { load } from "cheerio";
import type { EmailSubscription } from "@/lib/features/email/schemas/subscription";

export function detectSubscriptionEmails(
    emailContent: string,
    headers: Record<string, string>
): Partial<EmailSubscription> {
    const $ = load(emailContent);

    // Common newsletter indicators
    const newsletterKeywords = [
        "unsubscribe",
        "subscription",
        "newsletter",
        "marketing",
        "update preferences",
        "email preferences",
        "manage subscriptions",
        "notification",
        "social",
        "network",
        "promotion",
        "account",
    ];

    // Find unsubscribe link
    const unsubscribeLink = findUnsubscribeLink($) || headers["list-unsubscribe"];
    const unsubscribeEmail = extractUnsubscribeEmail(headers["list-unsubscribe"]);

    // Determine subscription type
    const type = determineSubscriptionType(emailContent, headers, newsletterKeywords);

    return {
        sender: headers.from,
        domain: extractDomain(headers.from),
        type,
        unsubscribeLink,
        unsubscribeEmail,
        status: "active",
        lastEmailAt: new Date(),
    };
}

function findUnsubscribeLink($: any): string | undefined {
    const unsubscribeLinks = $(
        'a[href*="unsubscribe"], a[href*="opt-out"], a:contains("unsubscribe"), a:contains("opt out")'
    );
    return unsubscribeLinks.first().attr("href");
}

function extractUnsubscribeEmail(listUnsubscribe?: string): string | undefined {
    if (!listUnsubscribe) return undefined;
    const emailMatch = listUnsubscribe.match(/mailto:([^\s<>]+@[^\s<>]+)/);
    return emailMatch ? emailMatch[1] : undefined;
}

function determineSubscriptionType(
    content: string,
    headers: Record<string, string>,
    keywords: string[]
): EmailSubscription["type"] {
    const contentLower = content.toLowerCase();
    const subjectLower = (headers.subject || "").toLowerCase();

    const hasKeyword = (type: string) =>
        keywords.filter((k) => k.includes(type)).some((k) => contentLower.includes(k) || subjectLower.includes(k));

    if (hasKeyword("newsletter")) return "newsletter";
    if (hasKeyword("marketing") || hasKeyword("promotion")) return "marketing";
    if (hasKeyword("notification") || hasKeyword("account")) return "transactional";
    if (hasKeyword("social") || hasKeyword("network")) return "social";

    return "other";
}

function extractDomain(email: string): string {
    const match = email.match(/@([^>]+)>/);
    if (match) return match[1];

    const parts = email.split("@");
    return parts.length > 1 ? parts[1] : email;
}
