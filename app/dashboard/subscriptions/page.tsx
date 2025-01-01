"use client";

import { SubscriptionList } from "@/components/email/subscription-list";
import { useSubscriptions, useUnsubscribe } from "@/services/email/hooks/use-subscriptions";

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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