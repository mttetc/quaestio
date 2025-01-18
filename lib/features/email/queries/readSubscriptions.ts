"use server";

import { db } from "@/lib/core/db";
import { emailSubscriptions } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { eq } from "drizzle-orm";
import type { EmailSubscription } from "../schemas/email";

export async function readSubscriptions(): Promise<EmailSubscription[]> {
    const user = await readUser();
    return db.query.emailSubscriptions.findMany({
        where: eq(emailSubscriptions.userId, user.id),
    });
}
