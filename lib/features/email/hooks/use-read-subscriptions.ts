"use client";

import { useQuery } from "@tanstack/react-query";
import { readSubscriptions } from "../queries/readSubscriptions";
import { type EmailSubscription } from "../schemas/subscription";

export function useReadSubscriptions() {
    return useQuery<EmailSubscription[]>({
        queryKey: ["emailSubscriptions"],
        queryFn: readSubscriptions,
    });
}
