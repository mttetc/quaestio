'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmailAccounts, getSubscriptions, unsubscribe } from "../api";

export function useEmailAccounts() {
    return useQuery({
        queryKey: ["emailAccounts"],
        queryFn: getEmailAccounts
    });
}

export function useSubscriptions() {
    return useQuery({
        queryKey: ["subscriptions"],
        queryFn: getSubscriptions
    });
}

export function useUnsubscribe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unsubscribe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        }
    });
} 