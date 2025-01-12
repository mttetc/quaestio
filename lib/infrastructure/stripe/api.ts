import { z } from "zod";
import { stripe } from "./client";
import { stripeProductSchema, type StripeProduct } from "./types";

export async function getProducts(): Promise<StripeProduct[]> {
    const products = await stripe.products.list({
        active: true,
        expand: ["data.default_price", "data.prices"],
    });

    const result = z.array(stripeProductSchema).safeParse(products.data);
    if (!result.success) {
        throw new Error("Failed to validate Stripe products");
    }

    return result.data;
}

export async function createCheckoutSession(priceId: string, userId: string) {
    const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        customer_email: userId,
    });

    return session;
}

export async function createPortalSession(customerId: string) {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return session;
}
