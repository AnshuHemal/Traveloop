import { TripCardSkeleton } from "@/components/shared/skeleton";

export default function ExploreLoading() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero skeleton */}
      <div className="overflow-hidden rounded-2xl bg-primary/20 px-6 py-10 sm:px-10 sm:py-14">
        <div className="max-w-2xl flex flex-col gap-4">
          <div className="h-4 w-40 animate-pulse rounded-full bg-white/20" />
          <div className="h-10 w-56 animate-pulse rounded-lg bg-white/20" />
          <div className="h-4 w-80 animate-pulse rounded-lg bg-white/20" />
        </div>
      </div>

      {/* Toolbar skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-12 w-full animate-pulse rounded-2xl bg-muted/60" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-muted/60" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
