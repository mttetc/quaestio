"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchTokenBalance() {
  const response = await fetch('/api/tokens/balance');
  if (!response.ok) {
    throw new Error('Failed to fetch token balance');
  }
  const data = await response.json();
  return data.balance;
}

export function useTokenBalance() {
  return useQuery({
    queryKey: ['tokenBalance'],
    queryFn: fetchTokenBalance,
  });
}