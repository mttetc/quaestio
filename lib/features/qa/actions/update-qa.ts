"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { revalidatePath } from "next/cache";
import { eq, type InferSelectModel } from "drizzle-orm";

export async function updateQA(id: string, qa: Partial<InferSelectModel<typeof qaEntries>>) {
    const now = new Date();

    // Get the current entry to calculate response time
    const [currentEntry] = await db
        .select()
        .from(qaEntries)
        .where(eq(qaEntries.id, id));

    if (!currentEntry) {
        throw new Error("QA entry not found");
    }

    // Calculate response time in hours if this is the first update
    const responseTimeHours = currentEntry.responseTimeHours ?? 
        (now.getTime() - currentEntry.createdAt.getTime()) / (1000 * 60 * 60);

    const [entry] = await db
        .update(qaEntries)
        .set({
            ...qa,
            responseTimeHours: Math.round(responseTimeHours * 10) / 10, // Round to 1 decimal place
            updatedAt: now,
        })
        .where(eq(qaEntries.id, id))
        .returning();

    revalidatePath("/dashboard/qa");
    return entry;
}
