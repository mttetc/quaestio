'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/core/db';
import { users } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/infrastructure/stripe';
import { TOKEN_PACKAGES } from '@/lib/shared/config/pricing';

export async function createCheckoutSession(packageId: string) {
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
  const { data: { user } } = await supabase.auth.getUser();

  const package_ = TOKEN_PACKAGES[packageId as keyof typeof TOKEN_PACKAGES];
  
  if (!package_) {
    throw new Error('Invalid package');
  }

  // Get or create Stripe customer
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user!.id),
  });

  let stripeCustomerId = dbUser?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user!.email,
      metadata: {
        userId: user!.id,
      },
    });
    
    await db.update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, user!.id));
    
    stripeCustomerId = customer.id;
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price: package_.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
    metadata: {
      userId: user!.id,
      packageId: package_.id,
      tokens: package_.tokens.toString(),
    },
  });

  return { url: session.url };
} 