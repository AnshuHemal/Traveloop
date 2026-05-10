import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { TripHeader } from "./_components/trip-header";
import { ItineraryBuilder } from "./_components/itinerary-builder";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ destination?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    select: { title: true },
  });
  return {
    title: trip ? `${trip.title} — Traveloop` : "Trip — Traveloop",
  };
}

export default async function TripDetailPage({ params, searchParams }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const { destination } = await searchParams;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      _count: { select: { stops: true } },
      stops: {
        include: {
          activities: {
            orderBy: [{ date: "asc" }, { order: "asc" }],
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Trip header ── */}
      <FadeIn direction="down">
        <TripHeader trip={trip} />
      </FadeIn>

      {/* ── Itinerary section ── */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col gap-4">
          {/* Section title */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-base">🗺️</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Itinerary</h2>
                <p className="text-xs text-muted-foreground">
                  Add stops, assign activities, and build your day-by-day plan
                </p>
              </div>
            </div>
            {trip.stops.length > 0 && (
              <Link
                href={`/trips/${trip.id}/itinerary`}
                className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                View itinerary →
              </Link>
            )}
          </div>

          {/* Builder */}
          <ItineraryBuilder
            tripId={trip.id}
            tripCurrency={trip.currency}
            initialStops={trip.stops}
            defaultDestination={destination}
          />
        </div>
      </FadeIn>

    </div>
  );
}
