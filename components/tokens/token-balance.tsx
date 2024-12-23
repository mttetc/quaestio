"use client";

import { Coins } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatTokenAmount } from '@/lib/tokens/utils';

export function TokenBalance() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['tokenBalance'],
    queryFn: async () => {
      const response = await fetch('/api/tokens/balance');
      if (!response.ok) throw new Error('Failed to fetch token balance');
      const data = await response.json();
      return data.balance;
    },
  });

  if (isLoading || balance === undefined) {
    return <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
      <Coins className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">
        {formatTokenAmount(balance)}
      </span>
    </div>
  );
}