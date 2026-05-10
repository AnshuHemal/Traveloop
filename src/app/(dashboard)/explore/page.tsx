import type { Metadata } from "next";
import { Suspense } from "react";
import { Compass, TrendingUp, Globe, DollarSign } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { CITIES, filterCities } from "@/lib/cities-data";
import { ExploreToolbar } from "./_components/explore-toolbar";
import { ExploreClient } from "./_components/explore-client";

export const metadata: Metadata = {
  title: "Explore Destinations — Traveloop",
  description: "Discover cities around the world and add them to your travel itinerary.",
};

interface PageProps {
  searchParams: Promise<{
    q?:       string;
    region?:  string;
    maxCost?: string;
    sort?:    string;
  }>;
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const q       = params.q       ?? "";
  const region  = params.region  ?? "All";
  const maxCost = parseInt(params.maxCost ?? "0", 10);
  const sort    = params.sort    ?? "popularity";

  // Filter cities
  const filteredCities = filterCities(CITIES, q, region, maxCost, sort);

  // Fetch user's trips for "Add to trip" modal
  const trips = await prisma.trip.findMany({
    where: { userId: user.id, status: { not: "COMPLETED" } },
    select: {
      id: true,
      title: true,
      status: true,
      _count: { select: { stops: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Stats
  const budgetCities  = CITIES.filter((c) => c.costIndex <= 2).length;
  const popularCities = CITIES.filter((c) => c.popularity >= 4).length;
  const regions       = [...new Set(CITIES.map((c) => c.region))].length;

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Hero banner ── */}
      <FadeIn direction="down">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 px-6 py-10 sm:px-10 sm:py-14">
          {/* Decorative blobs */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 size-48 rounded-full bg-white/8 blur-2xl" />

          {/* Floating destination pills */}
          <div className="absolute right-6 top-6 hidden flex-col gap-2 lg:flex">
            {["🗼 Paris", "🗾 Tokyo", "🏝️ Santorini", "🌴 Bali"].map((pill, i) => (
              <span
                key={pill}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="relative max-w-2xl">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Compass className="size-5 text-white" />
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {CITIES.length} destinations worldwide
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore the world
            </h1>
            <p className="mb-6 text-sm text-white/75 leading-relaxed">
              Discover cities, compare budgets, and add destinations directly to your trip itinerary.
            </p>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Globe,      label: `${regions} regions`,          bg: "bg-white/15" },
                { icon: TrendingUp, label: `${popularCities} top picks`,  bg: "bg-white/15" },
                { icon: DollarSign, label: `${budgetCities} budget gems`, bg: "bg-white/15" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur-sm ${s.bg}`}
                >
                  <s.icon className="size-3.5 text-white/80" />
                  <span className="text-xs font-medium text-white">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Toolbar ── */}
      <FadeIn delay={0.1}>
        <Suspense>
          <ExploreToolbar
            totalCount={CITIES.length}
            filteredCount={filteredCities.length}
          />
        </Suspense>
      </FadeIn>

      {/* ── City grid / list ── */}
      <FadeIn delay={0.15}>
        <ExploreClient cities={filteredCities} trips={trips} />
      </FadeIn>

    </div>
  );
}
