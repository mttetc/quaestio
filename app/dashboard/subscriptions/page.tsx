"use client";

import { SubscriptionList } from "@/components/email/subscription-list";
import { useSubscriptions, useUnsubscribe } from "@/services/email/hooks/use-email";
import type { EmailSubscription } from "@/services/email/subscription/types";

function adaptSubscription(sub: any): EmailSubscription {
    return {
        ...sub,
        lastReceived: new Date().toISOString(),
        emailCount: 0,
        unsubscribeMethod: 'link'
    };
}

export default function SubscriptionsPage() {
    const { data: rawSubscriptions, isLoading } = useSubscriptions();
    const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();

    if (isLoading || !rawSubscriptions) {
        return <div>Loading...</div>;
    }

    const subscriptions = rawSubscriptions.map(adaptSubscription);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Email Subscriptions</h2>
                <p className="text-muted-foreground">
                    Manage your email subscriptions and newsletters
                </p>
            </div>

            <SubscriptionList 
                subscriptions={subscriptions}
                onUnsubscribe={unsubscribe}
                isUnsubscribing={isUnsubscribing}
            />
        </div>
    );
}