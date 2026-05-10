import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";

export default function TripNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <Plane className="size-8 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-foreground">Trip not found</h2>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            This trip doesn&apos;t exist, was deleted, or you don&apos;t have access to it.
          </p>
        </div>

        <Link
          href="/trips"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to my trips
        </Link>
      </div>
    </div>
  );
}
