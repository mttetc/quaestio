import { db } from '@/services/db';
import { users } from '@/lib/core/db/schema';
import { eq, sql } from 'drizzle-orm';
import { SUBSCRIPTION_TIERS } from '@/lib/shared/config/pricing';

export async function checkUserQuota(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const lastReset = user.lastUsageReset;
  
  // Reset monthly usage if it's a new month
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    await db.update(users)
      .set({ 
        monthlyUsage: 0,
        lastUsageReset: now,
      })
      .where(eq(users.id, userId));
    return true;
  }

  const tier = SUBSCRIPTION_TIERS[user.subscriptionTier.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS];
  return user.monthlyUsage < tier.monthlyQuota;
}

export async function incrementUserUsage(userId: string, count: number = 1) {
  await db.update(users)
    .set({ 
      monthlyUsage: sql`${users.monthlyUsage} + ${count}`,
    })
    .where(eq(users.id, userId));
} 