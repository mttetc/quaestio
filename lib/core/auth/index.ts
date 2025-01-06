import { users } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/core/db";
import { createClient } from "@/services/supabase/server";

export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}
