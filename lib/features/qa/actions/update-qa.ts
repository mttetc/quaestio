"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { revalidatePath } from "next/cache";
import { eq, type InferSelectModel } from "drizzle-orm";

export async function updateQA(id: string, qa: Partial<InferSelectModel<typeof qaEntries>>) {
    const [entry] = await db
        .update(qaEntries)
        .set({
            ...qa,
            updatedAt: new Date(),
        })
        .where(eq(qaEntries.id, id))
        .returning();

    revalidatePath("/dashboard/qa");
    return entry;
}
