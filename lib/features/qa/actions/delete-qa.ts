"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteQA(id: string) {
    await db.delete(qaEntries).where(eq(qaEntries.id, id));
    revalidatePath("/dashboard/qa");
}
