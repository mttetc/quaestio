"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQA } from "../actions/delete-qa";
import { qaEntries } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export function useDeleteQA() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteQA,
        // Optimistically update the cache value on mutate
        onMutate: async (id) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["qas"] });

            // Snapshot the previous value
            const previousQAs = queryClient.getQueryData<InferSelectModel<typeof qaEntries>[]>(["qas"]);

            // Optimistically update to the new value
            if (previousQAs) {
                queryClient.setQueryData<InferSelectModel<typeof qaEntries>[]>(["qas"], (old) => 
                    old?.filter(qa => qa.id !== id)
                );
            }

            // Return a context object with the snapshotted value
            return { previousQAs };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err: Error, id: string, context?: { previousQAs: InferSelectModel<typeof qaEntries>[] | undefined }) => {
            console.error("Error deleting QA:", err);
            if (context?.previousQAs) {
                queryClient.setQueryData(["qas"], context.previousQAs);
            }
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}
