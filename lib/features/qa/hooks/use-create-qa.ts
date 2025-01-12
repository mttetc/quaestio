"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQA } from "../actions/create-qa";

export function useCreateQA() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createQA,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}
