import { db } from '@/lib/db';
import { users, tokenTransactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { TokenTransactionType } from './types';

export async function getUserTokenBalance(userId: string): Promise<number> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user?.availableTokens ?? 0;
}

export async function addTokens(
  userId: string,
  amount: number,
  type: TokenTransactionType,
  description: string,
  stripePaymentId?: string
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({
        availableTokens: (u) => `${u.availableTokens} + ${amount}`,
      })
      .where(eq(users.id, userId));

    await tx.insert(tokenTransactions).values({
      userId,
      amount,
      type,
      description,
      stripePaymentId,
    });
  });
}

export async function useTokens(
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || user.availableTokens < amount) {
    return false;
  }

  await addTokens(userId, -amount, 'usage', description);
  return true;
}