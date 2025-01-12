"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { type InferSelectModel } from "drizzle-orm";

export async function createQA(
    data: Omit<InferSelectModel<typeof qaEntries>, "id" | "userId" | "createdAt" | "updatedAt">
) {
    const user = await readUser();

    const [qa] = await db
        .insert(qaEntries)
        .values({
            userId: user.id,
            ...data,
        })
        .returning();

    return qa;
}
