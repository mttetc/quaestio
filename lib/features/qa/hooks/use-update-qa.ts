"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQA } from "../actions/update-qa";
import { qaEntries } from "@/lib/core/db/schema";
import { type InferSelectModel } from "drizzle-orm";

type UpdateQAVariables = {
    id: string;
    qa: Partial<InferSelectModel<typeof qaEntries>>;
};

export function useUpdateQA() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, qa }: UpdateQAVariables) => updateQA(id, qa),
        // Optimistically update the cache value on mutate
        onMutate: async ({ id, qa }: UpdateQAVariables) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["qas"] });
            await queryClient.cancelQueries({ queryKey: ["qa", id] });

            // Snapshot the previous values
            const previousQAs = queryClient.getQueryData<InferSelectModel<typeof qaEntries>[]>(["qas"]);
            const previousQA = queryClient.getQueryData<InferSelectModel<typeof qaEntries>>(["qa", id]);

            // Optimistically update to the new value
            if (previousQAs) {
                queryClient.setQueryData<InferSelectModel<typeof qaEntries>[]>(["qas"], (old) =>
                    old?.map((item) => (item.id === id ? { ...item, ...qa } : item))
                );
            }

            if (previousQA) {
                queryClient.setQueryData<InferSelectModel<typeof qaEntries>>(["qa", id], (old) =>
                    old ? { ...old, ...qa } : old
                );
            }

            // Return a context with the snapshotted value
            return { previousQAs, previousQA };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, variables, context?: { 
            previousQAs?: InferSelectModel<typeof qaEntries>[];
            previousQA?: InferSelectModel<typeof qaEntries>;
        }) => {
            console.error("Error updating QA:", err);
            if (context?.previousQAs) {
                queryClient.setQueryData(["qas"], context.previousQAs);
            }
            if (context?.previousQA) {
                queryClient.setQueryData(["qa", variables.id], context.previousQA);
            }
        },
        // Always refetch after error or success
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
            queryClient.invalidateQueries({ queryKey: ["qa", variables.id] });
        },
    });
}
