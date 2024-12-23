import { ROLE_PERMISSIONS, type UserRole } from '../config/roles';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function getUserRole(userId: string): Promise<UserRole> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user?.role || 'free';
}

export async function canConnectMoreEmails(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role];
  const connectedEmails = await db.query.emailAccounts.findMany({
    where: eq(users.id, userId),
  });
  
  return permissions.maxEmailAccounts === -1 || 
         connectedEmails.length < permissions.maxEmailAccounts;
}

export async function hasExtractionQuota(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role];
  
  // Unlimited quota for certain roles
  if (permissions.monthlyExtractionsLimit === -1) return true;
  
  // Reset monthly quota if it's a new month
  const now = new Date();
  const lastReset = user.lastExtractionReset;
  
  if (lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear()) {
    await db.update(users)
      .set({ 
        monthlyExtractions: 0,
        lastExtractionReset: now,
      })
      .where(eq(users.id, userId));
    return true;
  }
  
  return user.monthlyExtractions < permissions.monthlyExtractionsLimit;
}