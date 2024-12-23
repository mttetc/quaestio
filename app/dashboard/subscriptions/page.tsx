"use client";

import { SubscriptionList } from "@/components/email/subscription-list";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await fetch('/api/email/subscriptions');
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      return response.json();
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error('Failed to unsubscribe');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

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
        onUnsubscribe={(ids) => unsubscribeMutation.mutate(ids)}
        isUnsubscribing={unsubscribeMutation.isPending}
      />
    </div>
  );
}