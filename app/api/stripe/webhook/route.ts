import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/services/stripe/client';
import { db } from '@/services/db';
import { users } from '@/lib/core/db/schema';
import { eq } from 'drizzle-orm';
import { handleSubscriptionChange } from '@/services/stripe/api';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse('Webhook Error', { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return new NextResponse('Webhook Error', { status: 400 });
    }

    const { type, data } = event;

    try {
        switch (type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = data.object;
                await handleSubscriptionChange(
                    subscription.id,
                    subscription.customer as string,
                    subscription.status
                );
                break;
            }
            case 'checkout.session.completed': {
                const session = data.object;
                if (session.mode === 'subscription') {
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription as string
                    );
                    await handleSubscriptionChange(
                        subscription.id,
                        subscription.customer as string,
                        subscription.status
                    );
                }
                break;
            }
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return new NextResponse('Webhook Error', { status: 400 });
    }
}
