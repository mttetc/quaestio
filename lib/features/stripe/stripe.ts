'use server';

import { getCurrentUser } from "@/lib/core/auth";
import { stripe } from "@/services/stripe/client";
import { db } from "@/services/db";
import { subscriptions } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";

export async function createCheckoutSession(priceId: string) {
    const user = await getCurrentUser();
    const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return session;
}

export async function createBillingPortalSession() {
    const user = await getCurrentUser();
    const [subscription] = await db.select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

    if (!subscription?.stripeCustomerId) {
        throw new Error('No subscription found');
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return session;
}

export async function getActiveSubscription() {
    const user = await getCurrentUser();
    const [subscription] = await db.select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

    return subscription;
} 