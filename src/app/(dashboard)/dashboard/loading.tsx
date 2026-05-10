import { HeroSkeleton, StatCardSkeleton, TripCardSkeleton } from "@/components/shared/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero */}
      <HeroSkeleton />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick actions placeholder */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>

      {/* Trips grid */}
      <div>
        <div className="mb-4 h-6 w-32 animate-pulse rounded-lg bg-muted/60" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
