import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/infrastructure/stripe/client";
import { db } from "@/lib/core/db";
import { profiles } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

async function handleSubscriptionChange(customerId: string, status: string) {
    await db
        .update(profiles)
        .set({
            subscriptionTier: status === "active" ? "PRO" : "FREE",
        })
        .where(eq(profiles.stripeCustomerId, customerId));
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse("Missing signature or webhook secret", { status: 400 });
    }

    try {
        const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET) as Stripe.Event;

        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                if (typeof subscription.customer !== "string") {
                    throw new Error("Invalid customer ID in subscription");
                }
                await handleSubscriptionChange(subscription.customer, subscription.status);
                break;
            }
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (!session.subscription || typeof session.customer !== "string") {
                    throw new Error("Missing subscription or invalid customer ID in session");
                }
                await handleSubscriptionChange(session.customer, "active");
                break;
            }
        }

        return new NextResponse(null, { status: 200 });
    } catch (err) {
        console.error("Error processing webhook:", err);
        return new NextResponse("Webhook error: " + (err instanceof Error ? err.message : "Unknown error"), {
            status: 400,
        });
    }
}
