"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQA } from "../actions/delete-qa";

export function useDeleteQA() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteQA,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qas"] });
        },
    });
}
