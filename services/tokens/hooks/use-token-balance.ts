"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface TokenBalance {
    available: number;
    used: number;
    total: number;
}

async function fetchTokenBalance() {
    return api.get<TokenBalance>("/api/tokens/balance");
}

export function useTokenBalance() {
    return useQuery({
        queryKey: ["tokenBalance"],
        queryFn: fetchTokenBalance,
    });
}
