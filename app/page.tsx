import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";

export default function LandingPage() {
    return (
        <>
            <SiteHeader />
            <main>
                <HeroSection />
                <FeatureSection />
                <PricingSection />
            </main>
            <SiteFooter />
        </>
    );
}
