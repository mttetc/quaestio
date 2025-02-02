"use server";

import { db } from "@/lib/core/db";
import { profiles } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const profileSchema = createSelectSchema(profiles);
const roleSchema = z.enum(["user", "admin"]);

export async function isAdmin(userId: string) {
    const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    const result = profileSchema.safeParse(user);
    return result.success && result.data.role === "admin";
}

export async function isUser(userId: string) {
    const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    const result = profileSchema.safeParse(user);
    return result.success && result.data.role === "user";
}

export async function setRole(userId: string, role: "user" | "admin") {
    const result = roleSchema.safeParse(role);
    if (!result.success) {
        throw new Error(`Invalid role: ${result.error.message}`);
    }

    await db.update(profiles).set({ role: result.data }).where(eq(profiles.id, userId));
}

export async function getRole(userId: string) {
    const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    const result = profileSchema.safeParse(user);
    return result.success ? result.data.role : "user";
}

export async function requireAdmin(userId: string) {
    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
        throw new Error("Unauthorized");
    }
}

export async function requireUser(userId: string) {
    const isNormalUser = await isUser(userId);
    if (!isNormalUser) {
        throw new Error("Unauthorized");
    }
}

export async function setAdmin(userId: string) {
    const result = roleSchema.safeParse("admin");
    if (!result.success) {
        throw new Error(`Invalid role update: ${result.error.message}`);
    }

    await db.update(profiles).set({ role: result.data }).where(eq(profiles.id, userId));
}
