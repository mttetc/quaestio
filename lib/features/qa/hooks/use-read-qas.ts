"use client";

import { useQuery } from "@tanstack/react-query";
import type { QAFilter } from "../schemas/qa";
import { readQAs, readQA } from "../queries/readQAs";
import { qaEntries } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export function useReadQAs(filter?: QAFilter) {
    return useQuery<InferSelectModel<typeof qaEntries>[]>({
        queryKey: ["qas", filter],
        queryFn: () => readQAs(filter),
    });
}

export function useReadQA(id: string) {
    return useQuery<InferSelectModel<typeof qaEntries> | undefined>({
        queryKey: ["qa", id],
        queryFn: () => readQA(id),
    });
}
