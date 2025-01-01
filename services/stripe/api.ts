'use server';

import { getCurrentUser } from '@/lib/core/auth';
import { stripe } from './client';
import { db } from '@/services/db';
import { users } from '@/lib/core/db/schema';
import { eq, sql } from 'drizzle-orm';
import { SUBSCRIPTION_TIERS } from '@/lib/shared/config/pricing';

export async function getCurrentSubscription() {
    const user = await getCurrentUser();

    return {
        tier: user?.subscriptionTier || 'FREE',
        status: 'ACTIVE'
    };
}

export async function cancelSubscription() {
    const user = await getCurrentUser();

    if (!user?.stripeCustomerId) {
        throw new Error('No active subscription');
    }

    const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1
    });

    if (subscriptions.data.length === 0) {
        throw new Error('No active subscription');
    }

    await stripe.subscriptions.cancel(subscriptions.data[0].id);

    await db.update(users)
        .set({ 
            subscriptionTier: 'FREE',
            subscriptionStatus: 'CANCELED'
        })
        .where(eq(users.id, user.id));
}

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

export async function createCheckoutSession(priceId: string) {
    const user = await getCurrentUser();

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                userId: user.id,
            },
        });

        await db.update(users)
            .set({ stripeCustomerId: customer.id })
            .where(eq(users.id, user.id));

        stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return session;
}

export async function createBillingPortalSession() {
    const user = await getCurrentUser();

    if (!user.stripeCustomerId) {
        throw new Error('No subscription found');
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return session;
}

export async function handleSubscriptionChange(
    subscriptionId: string,
    customerId: string,
    status: string
) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    
    // Find the subscription tier that matches this price ID
    const tier = Object.entries(SUBSCRIPTION_TIERS).find(
        ([_, config]) => config.stripePriceId === priceId
    )?.[0] as keyof typeof SUBSCRIPTION_TIERS | undefined;

    if (!tier) {
        throw new Error('Invalid price ID');
    }

    await db.update(users)
        .set({ 
            subscriptionTier: tier as 'FREE' | 'PRO' | 'ENTERPRISE',
            subscriptionStatus: status.toUpperCase() as 'ACTIVE' | 'INACTIVE' | 'CANCELED',
            stripeSubscriptionId: subscriptionId
        })
        .where(eq(users.stripeCustomerId, customerId));
} 