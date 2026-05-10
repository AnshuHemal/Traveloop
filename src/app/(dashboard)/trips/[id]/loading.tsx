import { StopCardSkeleton } from "@/components/shared/skeleton";

export default function TripDetailLoading() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      {}
      <div className="overflow-hidden rounded-2xl bg-primary/20 px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-white/20" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-white/20" />
          </div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-white/20" />
          <div className="h-4 w-48 animate-pulse rounded-lg bg-white/20" />
          <div className="flex gap-3">
            <div className="h-5 w-20 animate-pulse rounded-lg bg-white/20" />
            <div className="h-5 w-24 animate-pulse rounded-lg bg-white/20" />
          </div>
        </div>
      </div>

      {}
      <div className="mt-6 flex gap-0 border-b border-border">
        {["Overview", "Itinerary", "Budget", "Share", "Edit"].map((tab) => (
          <div key={tab} className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded-lg bg-muted/60" />
          </div>
        ))}
      </div>

      {}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-8 w-24 animate-pulse rounded-xl bg-muted/60" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <StopCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
