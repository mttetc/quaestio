"use client";

import { useQuery } from "@tanstack/react-query";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { readEmailAccounts } from "../queries/readEmailAccounts";

type EmailAccount = InferSelectModel<typeof emailAccounts>;

export function useReadEmailAccounts() {
    return useQuery<EmailAccount[]>({
        queryKey: ["emailAccounts"],
        queryFn: readEmailAccounts,
    });
}
