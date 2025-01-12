"use client";

import { useQuery } from "@tanstack/react-query";
import { readTokenBalance } from "../queries/tokens";
import type { TokenBalance } from "../schemas/tokens";
import { useReadUser } from "@/lib/features/auth/hooks/use-read-user";
import type { User } from "@/lib/features/auth/schemas/user";

export function useTokenBalance() {
    const userQuery = useReadUser();
    const user = userQuery.data as User | undefined;

    return useQuery<TokenBalance>({
        queryKey: ["tokenBalance", user?.id] as const,
        queryFn: () => {
            if (!user?.id) throw new Error("User not found");
            return readTokenBalance(user.id);
        },
        enabled: !!user?.id,
    });
}
