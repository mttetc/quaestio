"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";
import { readQAs, readQA } from "../queries/readQAs";
import type { QAFilter } from "../schemas/qa";
import { qaEntries } from "@/lib/core/db/schema";

// Cache time configurations
const QA_CACHE_TIME = 1000 * 60 * 5; // 5 minutes
const QA_STALE_TIME = 1000 * 60; // 1 minute

export function useReadQAs(filter?: QAFilter) {
    return useQuery<InferSelectModel<typeof qaEntries>[]>({
        queryKey: ["qas", "list", filter],
        queryFn: () => readQAs(filter),
        staleTime: QA_STALE_TIME,
        gcTime: QA_CACHE_TIME,
    });
}

export function useReadQA(id?: string) {
    return useQuery<InferSelectModel<typeof qaEntries> | undefined>({
        queryKey: ["qas", "single", id],
        queryFn: () => readQA(id!),
        enabled: !!id,
        staleTime: QA_STALE_TIME,
        gcTime: QA_CACHE_TIME,
    });
}
