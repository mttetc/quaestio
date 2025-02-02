"use server";

import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { getQueryClient } from "@/lib/get-query-client";
import { getActiveProducts } from "@/lib/features/products/queries/read-products";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export async function LandingPage() {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["pricing-tiers"],
        queryFn: async () => {
            const products = await getActiveProducts();
            return products;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SiteHeader />
            <main>
                <HeroSection />
                <FeatureSection />
                <PricingSection />
            </main>
            <SiteFooter />
        </HydrationBoundary>
    );
}
