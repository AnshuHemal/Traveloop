import { TripCardSkeleton, TripListItemSkeleton } from "@/components/shared/skeleton";

export default function TripsLoading() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header skeleton */}
      <div className="overflow-hidden rounded-2xl bg-primary/20 px-8 py-10">
        <div className="flex items-center gap-4">
          <div className="size-14 animate-pulse rounded-2xl bg-white/20" />
          <div className="flex flex-col gap-2">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-white/20" />
            <div className="h-4 w-24 animate-pulse rounded-lg bg-white/20" />
          </div>
        </div>
      </div>

      {/* Toolbar skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-12 w-full animate-pulse rounded-2xl bg-muted/60" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-muted/60" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
