"use server";

import { db } from "@/lib/core/db";
import { emailSubscriptions } from "@/lib/core/db/schema";
import { inArray } from "drizzle-orm";
import { type UnsubscribeResult } from "@/lib/features/email/schemas/subscription";
import { handleUnsubscribe } from "@/lib/infrastructure/email/subscription/unsubscribe-handler";

export async function unsubscribeFromEmails(ids: string[]): Promise<UnsubscribeResult[]> {
    const dbSubscriptions = await db.select().from(emailSubscriptions).where(inArray(emailSubscriptions.id, ids));

    const settledResults = await Promise.allSettled(dbSubscriptions.map(handleUnsubscribe));

    const results = settledResults.map((result) => {
        if (result.status === "rejected") {
            return {
                success: false,
                message: result.reason instanceof Error ? result.reason.message : "Failed to unsubscribe",
                status: "failed" as const,
                error: result.reason instanceof Error ? result.reason.message : undefined,
                subscription: null,
            };
        }
        return result.value;
    });

    const failedResults = results.filter((r) => !r.success);
    if (failedResults.length > 0) {
        console.error(`Failed to unsubscribe from ${failedResults.length} subscriptions:`, failedResults);
    }

    return results;
}
