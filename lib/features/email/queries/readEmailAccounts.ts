"use server";

import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { eq } from "drizzle-orm";

type EmailAccount = InferSelectModel<typeof emailAccounts>;

export async function readEmailAccounts(): Promise<EmailAccount[]> {
    const user = await readUser();
    return db.query.emailAccounts.findMany({
        where: eq(emailAccounts.userId, user.id),
    });
}
