"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SubscriptionList } from "@/components/email/subscription-list";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readSubscriptions } from "@/lib/features/email/queries/readSubscriptions";
import { readEmailAccounts } from "@/lib/features/email/queries/readEmailAccounts";
import { PageProps } from "@/lib/types/components";

export default function SubscriptionsPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // Prefetch subscriptions and email accounts in parallel
    queryClient.prefetchQuery({
        queryKey: ["subscriptions"],
        queryFn: () => readSubscriptions(),
    });

    queryClient.prefetchQuery({
        queryKey: ["email-accounts"],
        queryFn: () => readEmailAccounts(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading subscriptions...</div>}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Email Subscriptions</h2>
                            <p className="text-muted-foreground">Manage your email subscriptions</p>
                        </div>

                        <SubscriptionList />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
