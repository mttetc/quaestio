"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTokenBalance } from "@/services/tokens/hooks/use-token-balance";

export function TokenBalance() {
  const { data: balance, isLoading } = useTokenBalance();

  if (isLoading) {
    return <div>Loading token balance...</div>;
  }

  if (!balance) {
    return null;
  }

  const percentage = Math.round((balance.used / balance.total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{balance.used.toLocaleString()} used</span>
            <span>{balance.available.toLocaleString()} available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}