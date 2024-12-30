import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { UserRole } from '@/lib/core/config/roles';
import { SUBSCRIPTION_TIERS } from '@/lib/shared/config/subscription';

export async function getUserRole(userId: string): Promise<UserRole> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user?.role ?? 'user';
}

export async function canConnectMoreEmails(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) return false;
  
  const tier = SUBSCRIPTION_TIERS[user.subscriptionTier];
  const connectedEmails = await db.query.emailAccounts.findMany({
    where: eq(users.id, userId),
  });
  
  return tier.maxEmailAccounts === -1 || 
         connectedEmails.length < tier.maxEmailAccounts;
}

export async function hasExtractionQuota(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) return false;
  
  const tier = SUBSCRIPTION_TIERS[user.subscriptionTier];
  
  // Unlimited quota for certain tiers
  if (tier.monthlyQuota === -1) return true;
  
  // Reset monthly quota if it's a new month
  const now = new Date();
  const lastReset = user.lastUsageReset;
  
  if (lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear()) {
    await db.update(users)
      .set({ 
        monthlyUsage: 0,
        lastUsageReset: now,
      })
      .where(eq(users.id, userId));
    return true;
  }
  
  return user.monthlyUsage < tier.monthlyQuota;
}