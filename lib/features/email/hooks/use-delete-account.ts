"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { deleteEmailAccount } from "../queries/deleteEmailAccount";

type EmailAccount = InferSelectModel<typeof emailAccounts>;

export function useDeleteEmailAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEmailAccount,
        onSuccess: () => {
            // Invalidate and refetch the email accounts list
            queryClient.invalidateQueries({ queryKey: ["emailAccounts"] });
        },
    });
}
