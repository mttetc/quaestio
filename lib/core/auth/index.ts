import { createClient } from '@/lib/infrastructure/supabase/server';
import { db } from '@/lib/core/db';
import { users } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Not authenticated');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
} 