import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, tokenTransactions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = await headers().then((headers) => headers.get("stripe-signature"));

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Stripe webhook secret not configured" }, { status: 500 });
    }

    try {
        const event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            const tokens = parseInt(session.metadata?.tokens || "0");

            if (userId && tokens) {
                // Add tokens to user's balance
                await db
                    .update(users)
                    .set({
                        availableTokens: sql`${users.availableTokens} + ${tokens}`,
                    })
                    .where(eq(users.id, userId));

                // Record the transaction
                await db.insert(tokenTransactions).values({
                    userId,
                    amount: tokens,
                    type: "purchase",
                    description: `Purchased ${tokens} tokens`,
                    stripePaymentId: session.payment_intent as string,
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Stripe webhook error:", error);
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }
}
