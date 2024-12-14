"use client";

import { useState } from 'react';
import { TOKEN_PACKAGES } from '@/lib/config/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, Zap } from 'lucide-react';

export function TokenPackages() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate purchase',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

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
              onClick={() => handlePurchase(package_.id)}
              disabled={loading === package_.id}
              className="w-full"
            >
              {loading === package_.id ? (
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