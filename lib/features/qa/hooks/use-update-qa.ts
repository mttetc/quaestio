"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQA } from "../actions/update-qa";
import { qaEntries } from "@/lib/core/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export function useUpdateQA() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, qa }: { id: string; qa: Partial<InferSelectModel<typeof qaEntries>> }) => updateQA(id, qa),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}
