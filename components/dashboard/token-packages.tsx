"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { ProductWithPrice } from "@/lib/types/products";

interface TokenPackagesProps {
    products: ProductWithPrice[];
}

export function TokenPackages({ products }: TokenPackagesProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {products.map((product) => (
                <Card key={product.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{`${product.tokens} tokens per month`}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-3xl font-bold">
                            ${product.price?.unit_amount ? (product.price.unit_amount / 100).toFixed(2) : "Contact us"}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{product.tokens.toLocaleString()} tokens</p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                    {product.monthly_quota === -1 ? "Unlimited" : product.monthly_quota} monthly
                                    extractions
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                    {product.max_email_accounts === -1 ? "Unlimited" : product.max_email_accounts} email
                                    accounts
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">Priority support</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">{product.price ? "Purchase" : "Contact Sales"}</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
