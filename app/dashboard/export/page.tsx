"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { QAExport } from "@/components/qa/qa-export";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readQAs } from "@/lib/features/qa/queries/readQAs";
import { PageProps } from "@/lib/types/components";

export default async function QAExportPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // Prefetch QAs for export
    queryClient.prefetchQuery({
        queryKey: ["qas", undefined],
        queryFn: () => readQAs(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading export options...</div>}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Export Q&As</h2>
                            <p className="text-muted-foreground">Export your Q&As in different formats</p>
                        </div>

                        <QAExport />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}