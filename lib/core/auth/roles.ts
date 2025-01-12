import { db } from "@/lib/core/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { SUBSCRIPTION_TIERS } from "@/lib/config/pricing";
import { eq } from "drizzle-orm";

export async function canConnectMoreEmails(userId: string): Promise<boolean> {
    const user = await readUser();

    const tier = SUBSCRIPTION_TIERS[user.subscriptionTier];
    const connectedEmails = await db.query.emailAccounts.findMany({
        where: eq(emailAccounts.userId, userId),
    });

    return tier.maxEmailAccounts === -1 || connectedEmails.length < tier.maxEmailAccounts;
}
