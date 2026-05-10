import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardHero } from "./_components/dashboard-hero";
import { StatsRow } from "./_components/stats-row";
import { TopDestinations } from "./_components/top-destinations";
import { RecentTripsSection } from "./_components/recent-trips-section";
import { BudgetHighlights } from "./_components/budget-highlights";
import { QuickActions } from "./_components/quick-actions";

export const metadata: Metadata = {
  title: "Dashboard — Traveloop",
  description: "Your travel planning hub. View trips, explore destinations, and track budgets.",
};

export default async function DashboardPage() {
  const user = await requireUser();

  // Fetch trips with full data for budget calculations
  const trips = await prisma.trip.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { stops: true } },
      stops: {
        select: {
          cityName: true,
          countryName: true,
          activities: { select: { cost: true, currency: true } },
          expenses:   { select: { amount: true, category: true } },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Derived stats
  const totalDestinations = trips.reduce((acc, t) => acc + t._count.stops, 0);
  const completedTrips    = trips.filter((t) => t.status === "COMPLETED").length;
  const ongoingTrips      = trips.filter((t) => t.status === "ONGOING" || t.status === "PLANNED").length;

  // Recent trips (last 6 for the grid)
  const recentTrips = trips.slice(0, 6).map((t) => ({
    id:          t.id,
    title:       t.title,
    description: t.description,
    status:      t.status,
    visibility:  t.visibility,
    currency:    t.currency,
    startDate:   t.startDate,
    endDate:     t.endDate,
    _count:      t._count,
    stops:       t.stops.map((s) => ({ cityName: s.cityName, countryName: s.countryName })),
  }));

  // Budget trips (need activities + expenses)
  const budgetTrips = trips.map((t) => ({
    id:       t.id,
    title:    t.title,
    currency: t.currency,
    stops:    t.stops.map((s) => ({
      activities: s.activities,
      expenses:   s.expenses,
    })),
  }));

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* ── Hero banner with search ── */}
      <DashboardHero
        userName={user.name?.split(" ")[0] ?? "Traveler"}
        tripCount={trips.length}
      />

      {/* ── Stats row ── */}
      {trips.length > 0 && (
        <StatsRow
          totalTrips={trips.length}
          totalDestinations={totalDestinations}
          completedTrips={completedTrips}
          ongoingTrips={ongoingTrips}
        />
      )}

      {/* ── Quick actions ── */}
      <QuickActions />

      {/* ── Top regional destinations ── */}
      <TopDestinations />

      {/* ── Previous trips ── */}
      <RecentTripsSection trips={recentTrips} totalCount={trips.length} />

      {/* ── Budget highlights (only if trips have budget data) ── */}
      <BudgetHighlights trips={budgetTrips} />

    </div>
  );
}
