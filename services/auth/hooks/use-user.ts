"use client";

import { completeOnboarding } from "@/lib/features/auth/actions/auth";
import { getUser, updateUser } from "@/lib/features/auth/actions/user";
import type { User } from "@/lib/schemas/user";
import { createClient } from "@/services/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
    return useQuery<User>({
        queryKey: ["user"],
        queryFn: getUser,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}

export function useCompleteOnboarding() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}
