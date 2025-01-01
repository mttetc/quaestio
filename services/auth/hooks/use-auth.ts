'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { getGmailAuthUrl, getOnboardingState, updateOnboardingStep, completeOnboarding } from "../api";

export function useGmailAuth() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: getGmailAuthUrl,
        onSuccess: (data) => {
            if (!data.url) {
                throw new Error('Authentication URL not received');
            }
            window.location.href = data.url;
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to connect email account. Please try again.",
                variant: "destructive",
            });
        },
    });
}

export function useOnboardingState() {
    return useQuery({
        queryKey: ["onboarding"],
        queryFn: getOnboardingState
    });
}

export function useUpdateOnboarding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOnboardingStep,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["onboarding"] });
        }
    });
} 