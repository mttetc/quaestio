import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { TOKEN_PACKAGES } from "@/lib/config/pricing";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { packageId } = await request.json();
        const package_ = TOKEN_PACKAGES[packageId as keyof typeof TOKEN_PACKAGES];

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
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
        });

        let stripeCustomerId = dbUser?.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            });

            await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, user.id));

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
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
            metadata: {
                userId: user.id,
                packageId: package_.id,
                tokens: package_.tokens.toString(),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}
