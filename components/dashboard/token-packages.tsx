"use client";

import { useState } from 'react';
import { TOKEN_PACKAGES } from '@/lib/config/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export function TokenPackages() {
  const { toast } = useToast();

  const { mutate: createCheckoutSession, isPending: isLoading } = useMutation({
    mutationFn: async (packageId: string) => {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      return response.json();
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate purchase',
        variant: 'destructive',
      });
    }
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.values(TOKEN_PACKAGES).map((package_) => (
        <Card key={package_.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {package_.name}
            </CardTitle>
            <CardDescription>
              {package_.tokens} tokens for ${(package_.price / 100).toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="mb-6 space-y-2 flex-1">
              {package_.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => createCheckoutSession(package_.id)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Purchase Tokens'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}