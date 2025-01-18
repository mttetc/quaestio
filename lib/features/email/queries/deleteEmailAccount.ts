"use server";

import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";

export async function deleteEmailAccount(id: string) {
    await db.delete(emailAccounts).where(eq(emailAccounts.id, id));
}
