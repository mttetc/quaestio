"use client";

import { useQuery } from "@tanstack/react-query";
import { readSubscriptions } from "../queries/readSubscriptions";

// Cache time configurations
const SUBSCRIPTIONS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const SUBSCRIPTIONS_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function useReadSubscriptions() {
    return useQuery({
        queryKey: ["emailSubscriptions"],
        queryFn: readSubscriptions,
        staleTime: SUBSCRIPTIONS_STALE_TIME,
        gcTime: undefined,
    });
}
