import type { EmailSubscription, UnsubscribeResult } from "@/lib/features/email/schemas/subscription";
import { db } from "@/lib/core/db";
import { emailSubscriptions } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";

export async function handleUnsubscribe(subscription: EmailSubscription): Promise<UnsubscribeResult> {
    try {
        if (subscription.unsubscribeLink) {
            // Handle link-based unsubscribe
            const response = await fetch(subscription.unsubscribeLink);
            if (!response.ok) {
                throw new Error(`Failed to unsubscribe: ${response.statusText}`);
            }
        } else if (subscription.unsubscribeEmail) {
            // Handle email-based unsubscribe
            // TODO: Implement email sending logic
            throw new Error("Email-based unsubscribe not implemented yet");
        } else {
            throw new Error("No unsubscribe method available");
        }

        // Update subscription status in database
        const [updated] = await db
            .update(emailSubscriptions)
            .set({ status: "unsubscribed", updatedAt: new Date() })
            .where(eq(emailSubscriptions.id, subscription.id))
            .returning();

        if (!updated) throw new Error("Failed to update subscription status");

        return {
            success: true,
            message: "Successfully unsubscribed",
            status: "completed" as const,
            error: undefined,
            subscription: { ...subscription, status: "unsubscribed" },
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to unsubscribe",
            status: "failed" as const,
            error: error instanceof Error ? error.message : undefined,
            subscription: null,
        };
    }
}
