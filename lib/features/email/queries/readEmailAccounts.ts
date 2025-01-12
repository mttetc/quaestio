"use server";

import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { eq } from "drizzle-orm";

export async function readEmailAccounts() {
    const user = await readUser();
    return db.query.emailAccounts.findMany({
        where: eq(emailAccounts.userId, user.id),
    });
}
