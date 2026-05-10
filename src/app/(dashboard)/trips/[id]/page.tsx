import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ItineraryBuilder } from "./_components/itinerary-builder";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ destination?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Traveloop` : "Trip — Traveloop" };
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
          activities: { orderBy: [{ date: "asc" }, { order: "asc" }] },
          expenses:   { select: { amount: true } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-foreground">Itinerary Builder</h2>
        <p className="text-sm text-muted-foreground">
          Add stops, assign activities, and build your day-by-day plan
        </p>
      </div>

      <ItineraryBuilder
        tripId={trip.id}
        tripCurrency={trip.currency}
        initialStops={trip.stops}
        defaultDestination={destination}
      />
    </div>
  );
}
