'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCheckoutSession, createBillingPortalSession, getCurrentSubscription, cancelSubscription } from "../api";

export interface Subscription {
    id: string;
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: string;
    plan: {
        id: string;
        name: string;
        price: number;
    };
}

export function useSubscription() {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: getCurrentSubscription
    });
}

export function useCreateCheckoutSession() {
    return useMutation({
        mutationFn: createCheckoutSession
    });
}

export function useCreateBillingPortalSession() {
    return useMutation({
        mutationFn: createBillingPortalSession
    });
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription"] });
        }
    });
} 