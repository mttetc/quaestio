"use client";

import { SubscriptionList } from "@/components/email/subscription-list";
import { useReadSubscriptions } from "@/lib/features/email/hooks/use-read-subscriptions";
import { useUnsubscribe } from "@/lib/features/email/hooks/use-unsubscribe";

export default function SubscriptionsPage() {
    const { data: subscriptions, isLoading } = useReadSubscriptions();
    const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();

    if (isLoading) {
        return (
            <div className="container py-8">
                <h1 className="mb-8 text-2xl font-bold">Email Subscriptions</h1>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="mb-8 text-2xl font-bold">Email Subscriptions</h1>
            <SubscriptionList
                subscriptions={subscriptions ?? []}
                onUnsubscribe={unsubscribe}
                isUnsubscribing={isUnsubscribing}
            />
        </div>
    );
}
