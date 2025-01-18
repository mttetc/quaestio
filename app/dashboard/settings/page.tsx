"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { readEmailAccounts } from "@/lib/features/email/queries/readEmailAccounts";
import { PageProps } from "@/lib/types/components";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // Prefetch user and email accounts in parallel
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["user"],
            queryFn: () => readUser(),
        }),
        queryClient.prefetchQuery({
            queryKey: ["email-accounts"],
            queryFn: () => readEmailAccounts(),
        }),
    ]);

    return (
        <ErrorBoundary>
            <Suspense>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <SettingsContent />
                </HydrationBoundary>
            </Suspense>
        </ErrorBoundary>
    );
}
