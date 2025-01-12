"use server";

import { db } from "@/lib/core/db";
import { qaEntries } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { desc, eq } from "drizzle-orm";
import type { QAFilter } from "../schemas/qa";

export async function readQAs(filter?: QAFilter) {
    const user = await readUser();
    return db.query.qaEntries.findMany({
        where: eq(qaEntries.userId, user.id),
        orderBy: desc(qaEntries.createdAt),
        limit: filter?.limit,
    });
}

export async function readQA(id: string) {
    const user = await readUser();
    return db.query.qaEntries.findFirst({
        where: (qa) => eq(qa.id, id) && eq(qa.userId, user.id),
    });
}
