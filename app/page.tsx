import { Suspense } from 'react';
import { SiteHeader } from '@/components/landing/site-header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureSection } from '@/components/landing/feature-section';
import { SiteFooter } from '@/components/landing/site-footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense>
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <FeatureSection />
        </main>
        <SiteFooter />
      </Suspense>
    </div>
  );
}