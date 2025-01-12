"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unsubscribeFromEmails } from "../actions/unsubscribe";

export function useUnsubscribe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unsubscribeFromEmails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["emailSubscriptions"] });
        },
    });
}
