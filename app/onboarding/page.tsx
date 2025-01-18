"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { OnboardingView } from "@/components/onboarding/onboarding-view";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageProps } from "@/lib/types/components";

export default async function OnboardingPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: readUser,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-pulse">Loading...</div>
                    </div>
                }>
                    <OnboardingView />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
