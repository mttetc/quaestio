"use client";

import { Coins } from 'lucide-react';
import { formatTokenAmount } from '@/lib/tokens/utils';
import { useTokenBalance } from '@/lib/hooks/use-token-balance';

export function TokenBalance() {
  const { data: balance, isLoading } = useTokenBalance();

  if (isLoading || balance === undefined) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
      <Coins className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">
        {formatTokenAmount(balance)}
      </span>
    </div>
  );
}