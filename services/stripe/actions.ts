"use server";

import { stripe } from "./client";
import { db } from "@/services/db";
import { users } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { SUBSCRIPTION_TIERS } from "@/lib/shared/config/pricing";

export async function createCheckoutSession(packageId: string, userId: string) {
  try {
    const package_ = SUBSCRIPTION_TIERS[packageId as keyof typeof SUBSCRIPTION_TIERS];
    if (!package_) {
      return { error: "Invalid package" };
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    let stripeCustomerId = dbUser?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: dbUser?.email,
        metadata: {
          userId,
        },
      });
      
      await db.update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));
      
      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: package_.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      metadata: {
        userId,
        packageId: package_.id,
        tokens: package_.tokens.toString(),
      },
    });

    return { url: session.url };
  } catch (error) {
    return { error: "Failed to create checkout session" };
  }
} 