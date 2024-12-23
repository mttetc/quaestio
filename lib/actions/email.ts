"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { emailAccounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { testConnection } from "@/lib/email/imap-connection";
import { encryptPassword } from "@/lib/auth/encryption";
import { ImapFlow } from "imapflow";

export async function connectEmailAccount(email: string, appPassword: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Test connection first
    const client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: email,
            pass: appPassword,
        },
    });
    await testConnection(client);

    // Store encrypted credentials
    const encryptedPassword = encryptPassword(appPassword);

    await db.insert(emailAccounts).values({
        userId: user!.id,
        email,
        provider: "gmail",
        accessToken: encryptedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return { success: true };
}

export async function getConnectedAccounts() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const accounts = await db.query.emailAccounts.findMany({
        where: eq(emailAccounts.userId, user!.id),
        columns: {
            id: true,
            email: true,
            provider: true,
            lastSynced: true,
            createdAt: true,
        },
    });

    return accounts;
}

export async function removeEmailAccount(accountId: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    await db.delete(emailAccounts).where(and(eq(emailAccounts.id, accountId), eq(emailAccounts.userId, user.id)));

    return { success: true };
}
