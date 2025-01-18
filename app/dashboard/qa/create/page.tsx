"use server";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { QAForm } from "@/components/qa/qa-form";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { PageProps } from "@/lib/types/components";

export default function CreateQAPage({ params, searchParams }: PageProps) {
    const queryClient = getQueryClient();

    // Prefetch user data
    queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: () => readUser(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Create Q&A</h2>
                            <p className="text-muted-foreground">Create a new question and answer pair</p>
                        </div>

                        <QAForm />
                    </div>
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}