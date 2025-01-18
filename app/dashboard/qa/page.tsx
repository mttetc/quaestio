"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { QAList } from "@/components/qa/qa-list";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageProps } from "@/lib/types/components";
import { readQAs } from "@/lib/features/qa/queries/readQAs";

export default function QAPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // No need to await since we configured the queryClient to dehydrate pending queries
    queryClient.prefetchQuery({
        queryKey: ["qas", undefined],
        queryFn: () => readQAs(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading Q&As...</div>}>
                    <QAList />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}
