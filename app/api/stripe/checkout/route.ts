import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe } from "@/lib/infrastructure/stripe/client";
import { SUBSCRIPTION_TIERS } from "@/lib/config/pricing";
import { db } from "@/lib/core/db";
import { profiles } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { packageId } = await request.json();
        const package_ = SUBSCRIPTION_TIERS[packageId as keyof typeof SUBSCRIPTION_TIERS];

        if (!package_) {
            return NextResponse.json({ error: "Invalid package" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get or create Stripe customer
        const dbUser = await db.query.profiles.findFirst({
            where: eq(profiles.id, user.id),
        });

        let stripeCustomerId = dbUser?.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            });

            await db.update(profiles).set({ stripeCustomerId: customer.id }).where(eq(profiles.id, user.id));

            stripeCustomerId = customer.id;
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: package_.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            currency: dbUser?.currency || "USD",
            payment_method_types: ["card"],
            billing_address_collection: "required",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
            metadata: {
                userId: user.id,
                packageId: package_.id,
                tokens: package_.tokens.toString(),
            },
            automatic_tax: { enabled: true },
            tax_id_collection: { enabled: true },
            customer_update: {
                shipping: "auto",
                address: "auto",
                name: "auto",
            },
            subscription_data: {
                metadata: {
                    userId: user.id,
                    packageId: package_.id,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}
