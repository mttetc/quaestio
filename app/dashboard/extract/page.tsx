"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { ExtractionForm } from "@/components/qa/extraction-form";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readEmailAccounts } from "@/lib/features/email/queries/readEmailAccounts";
import { PageProps } from "@/lib/types/components";

export default function ExtractPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // Prefetch extracts and email accounts in parallel
    queryClient.prefetchQuery({
        queryKey: ["email-accounts"],
        queryFn: () => readEmailAccounts(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading extracts...</div>}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Extract Knowledge</h2>
                            <p className="text-muted-foreground">Extract knowledge from your email threads</p>
                        </div>

                        <ExtractionForm />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
