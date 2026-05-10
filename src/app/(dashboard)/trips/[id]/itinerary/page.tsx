import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ViewToggle } from "./_components/view-toggle";
import { TimelineView } from "./_components/timeline-view";
import { ListView } from "./_components/list-view";
import { CalendarView } from "./_components/calendar-view";
import { BudgetSummary } from "./_components/budget-summary";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `${trip.title} — Itinerary | Traveloop` : "Itinerary — Traveloop" };
}

export default async function ItineraryViewPage({ params, searchParams }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const { view = "timeline" } = await searchParams;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      _count: { select: { stops: true } },
      stops: {
        include: {
          activities: { orderBy: [{ date: "asc" }, { order: "asc" }] },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip || trip.userId !== user.id) notFound();

  const totalActivities = trip.stops.reduce((acc, s) => acc + s.activities.length, 0);

  const currentView = (["timeline", "list", "calendar"].includes(view) ? view : "timeline") as
    "timeline" | "list" | "calendar";

  return (
    <div className="flex flex-col gap-6">
      {}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Full Itinerary</h2>
          <p className="text-xs text-muted-foreground">
            {trip.stops.length === 0
              ? "No stops added yet"
              : `${trip.stops.length} ${trip.stops.length === 1 ? "city" : "cities"} · ${totalActivities} activities`}
          </p>
        </div>
        <Suspense>
          <ViewToggle current={currentView} />
        </Suspense>
      </div>

      {}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          {currentView === "timeline" && (
            <TimelineView stops={trip.stops} currency={trip.currency} />
          )}
          {currentView === "list" && (
            <ListView stops={trip.stops} currency={trip.currency} />
          )}
          {currentView === "calendar" && (
            <CalendarView
              stops={trip.stops}
              currency={trip.currency}
              tripStartDate={trip.startDate}
            />
          )}
        </div>

        {}
        <div className="flex flex-col gap-5">
          <BudgetSummary stops={trip.stops} currency={trip.currency} />
        </div>
      </div>
    </div>
  );
}
