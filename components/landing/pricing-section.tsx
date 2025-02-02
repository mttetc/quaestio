"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveProducts } from "@/lib/features/products/queries/read-products";
import { useQuery } from "@tanstack/react-query";

function mapProductsToPricingTiers(products: Awaited<ReturnType<typeof getActiveProducts>>) {
    return products.map(
        (product) =>
            ({
                name: product.name,
                price: product.price?.unit_amount ? product.price.unit_amount / 100 : 0,
                description: `${product.tokens} tokens per month`,
                features: [
                    `${product.tokens} tokens per month`,
                    `${product.monthly_quota === -1 ? "Unlimited" : product.monthly_quota} monthly extractions`,
                    `${product.max_email_accounts === -1 ? "Unlimited" : product.max_email_accounts} email accounts`,
                    "Priority support",
                    "Advanced analytics",
                    "Custom integrations",
                ],
                buttonText: product.price ? "Subscribe Now" : "Contact Sales",
                buttonVariant: product.price ? "default" : "outline",
                featured: product.tier === "PRO",
            } as const)
    );
}

export function PricingSection() {
    const { data: tiers = [], isLoading } = useQuery({
        queryKey: ["pricing-tiers"],
        queryFn: async () => {
            const products = await getActiveProducts();
            return mapProductsToPricingTiers(products);
        },
    });

    return (
        <section className="container mx-auto py-24 sm:py-32" id="pricing">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Choose the plan that best fits your needs. All plans include a 14-day free trial.
                </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative flex flex-col rounded-2xl border bg-background p-8 ${
                            tier.featured ? "border-primary shadow-lg scale-105" : ""
                        }`}
                    >
                        {tier.featured && (
                            <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground">
                                Most Popular
                            </div>
                        )}
                        <div className="mb-5">
                            <h3 className="text-lg font-bold">{tier.name}</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold">${tier.price}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>
                        </div>

                        <ul className="mb-8 space-y-4 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm">
                                    <Check className="h-4 w-4 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button variant={tier.buttonVariant} className="w-full">
                            {tier.buttonText}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}
