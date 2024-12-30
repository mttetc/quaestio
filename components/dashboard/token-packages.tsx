"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { generatePackageFeatureKey } from '@/lib/utils/key-generation';

interface TokenPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  tokens: number;
  features: string[];
}

interface TokenPackagesProps {
  packages: TokenPackage[];
}

export function TokenPackages({ packages }: TokenPackagesProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {packages.map((package_) => (
        <Card key={package_.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{package_.name}</CardTitle>
            <CardDescription>{package_.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">${package_.price}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {package_.tokens.toLocaleString()} tokens
            </p>
            <ul className="mt-4 space-y-2">
              {package_.features.map((feature) => (
                <li key={generatePackageFeatureKey(package_.id, feature)} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Purchase</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}