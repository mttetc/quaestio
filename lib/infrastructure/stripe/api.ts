import { z } from "zod";
import { stripe } from "./client";
import { stripeProductSchema, type StripeProduct } from "./types";
import { readUser } from "@/lib/features/auth/queries/read-user";

export async function getProducts(): Promise<StripeProduct[]> {
    try {
        const products = await stripe.products.list({
            active: true,
            expand: ["data.default_price", "data.prices"],
        });

        const result = z.array(stripeProductSchema).safeParse(products.data);
        if (!result.success) {
            throw new Error("Failed to validate Stripe products");
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching Stripe products:", error);
        throw new Error("Failed to fetch Stripe products");
    }
}

export async function createCheckoutSession(priceId: string, userId: string) {
    try {
        const user = await readUser();
        const userCurrency = user.currency || "USD";

        const session = await stripe.checkout.sessions.create({
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            customer_email: userId,
            currency: userCurrency,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            automatic_tax: { enabled: true },
            tax_id_collection: { enabled: true },
            customer_update: {
                address: "auto",
                name: "auto",
            },
        });

        return session;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new Error("Failed to create checkout session");
    }
}

export async function createPortalSession(customerId: string) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return session;
    } catch (error) {
        console.error("Error creating portal session:", error);
        throw new Error("Failed to create portal session");
    }
}
