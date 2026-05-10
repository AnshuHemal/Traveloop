import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Hero } from "./(marketing)/_components/hero";
import { Stats } from "./(marketing)/_components/stats";
import { Features } from "./(marketing)/_components/features";
import { HowItWorks } from "./(marketing)/_components/how-it-works";
import { CTABanner } from "./(marketing)/_components/cta-banner";
import { MarketingNav } from "./(marketing)/_components/marketing-nav";
import { MarketingFooter } from "./(marketing)/_components/marketing-footer";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  keywords: [...siteConfig.keywords],
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTABanner />
      </main>
      <MarketingFooter />
    </div>
  );
}
