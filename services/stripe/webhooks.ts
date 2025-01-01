import { stripe } from "./client";
import { db } from "@/services/db";
import { users, tokenTransactions } from "@/lib/core/db/schema";
import { eq, sql } from "drizzle-orm";

export interface WebhookEvent {
  body: string;
  signature: string | null;
}

export async function handleWebhookEvent({ body, signature }: WebhookEvent) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook secret not configured");
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

    return { success: true };
  } catch (error) {
    console.error("Stripe webhook error:", error);
    throw new Error("Webhook signature verification failed");
  }
} 