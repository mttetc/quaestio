"use client";

import { useQuery } from "@tanstack/react-query";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { readEmailAccounts } from "../queries/readEmailAccounts";

// Cache time configurations
const EMAIL_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const EMAIL_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

type EmailAccount = InferSelectModel<typeof emailAccounts>;

export function useReadEmailAccounts() {
    return useQuery<EmailAccount[]>({
        queryKey: ["emailAccounts"],
        queryFn: readEmailAccounts,
        staleTime: EMAIL_STALE_TIME,
        gcTime: EMAIL_CACHE_TIME,
    });
}
