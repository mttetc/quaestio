import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/infrastructure/stripe/client";
import { db } from "@/lib/core/db";
import { profiles } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { logWebhookEvent, logWebhookError } from "@/lib/infrastructure/stripe/logger";

type WebhookHandlerResult = Promise<NextResponse>;

const isSubscriptionEvent = (
    event: Stripe.Event
): event is Stripe.Event & {
    data: { object: Stripe.Subscription };
} =>
    ["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(
        event.type
    );

const isCheckoutSessionEvent = (
    event: Stripe.Event
): event is Stripe.Event & {
    data: { object: Stripe.Checkout.Session };
} => event.type === "checkout.session.completed";

const updateSubscriptionTier = async (customerId: string, status: string) => {
    await db
        .update(profiles)
        .set({
            subscriptionTier: status === "active" ? "PRO" : "FREE",
        })
        .where(eq(profiles.stripeCustomerId, customerId));
};

const handleSubscriptionEvent = async (event: Stripe.Event): WebhookHandlerResult => {
    const subscription = event.data.object as Stripe.Subscription;
    if (typeof subscription.customer !== "string") {
        throw new Error("Invalid customer ID in subscription");
    }
    await updateSubscriptionTier(subscription.customer, subscription.status);
    return new NextResponse(null, { status: 200 });
};

const handleCheckoutSessionEvent = async (event: Stripe.Event): WebhookHandlerResult => {
    const session = event.data.object as Stripe.Checkout.Session;
    if (!session.subscription || typeof session.customer !== "string") {
        throw new Error("Missing subscription or invalid customer ID in session");
    }
    await updateSubscriptionTier(session.customer, "active");
    return new NextResponse(null, { status: 200 });
};

const isRetryableError = (error: Error): boolean =>
    !["No such event", "Invalid signature", "Missing signature"].some((msg) => error.message.includes(msg));

const handleWebhookError = (error: unknown): NextResponse => {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logWebhookError(err, "webhook_processing");
    return new NextResponse(`Webhook error: ${err.message}`, {
        status: isRetryableError(err) ? 500 : 400,
    });
};

export async function POST(request: NextRequest): WebhookHandlerResult {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse("Missing signature or webhook secret", { status: 400 });
    }

    try {
        const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET) as Stripe.Event;
        logWebhookEvent(event);

        if (isSubscriptionEvent(event)) {
            return handleSubscriptionEvent(event);
        }

        if (isCheckoutSessionEvent(event)) {
            return handleCheckoutSessionEvent(event);
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        return handleWebhookError(error);
    }
}
