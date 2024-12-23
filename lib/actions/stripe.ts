"use server";

import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TOKEN_PACKAGES } from "@/lib/config/pricing";

export async function createCheckoutSession(packageId: string, userId: string) {
  try {
    const package_ = TOKEN_PACKAGES[packageId as keyof typeof TOKEN_PACKAGES];
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