"use server";

import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { and, eq } from "drizzle-orm";

export async function removeEmailAccount(accountId: string, userId: string): Promise<void> {
    await db.delete(emailAccounts).where(and(eq(emailAccounts.id, accountId), eq(emailAccounts.userId, userId)));
}
