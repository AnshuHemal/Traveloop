import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import { EditTripForm } from "./_components/edit-trip-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id }, select: { title: true } });
  return { title: trip ? `Edit "${trip.title}" — Traveloop` : "Edit Trip — Traveloop" };
}

const GRADIENT_MAP: Record<string, string> = {
  DRAFT:     "from-muted/60 via-muted/30 to-transparent",
  PLANNED:   "from-primary/20 via-primary/10 to-transparent",
  ONGOING:   "from-emerald-500/20 via-emerald-500/10 to-transparent",
  COMPLETED: "from-violet-500/20 via-violet-500/10 to-transparent",
};

export default async function EditTripPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id:          true,
      title:       true,
      description: true,
      startDate:   true,
      endDate:     true,
      currency:    true,
      visibility:  true,
      coverImage:  true,
      status:      true,
      userId:      true,
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  const gradient = GRADIENT_MAP[trip.status] ?? GRADIENT_MAP.DRAFT;

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Breadcrumb ── */}
      <FadeIn direction="down">
        <Link
          href={`/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Back to trip
        </Link>
      </FadeIn>

      {/* ── Hero header ── */}
      <FadeIn delay={0.05}>
        <div className={cn(
          "relative overflow-hidden rounded-2xl bg-linear-to-br px-8 py-10",
          gradient,
        )}>
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/8 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 size-32 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex items-center gap-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm shadow-sm">
              <Pencil className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Edit trip
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the details for &ldquo;{trip.title}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Form card ── */}
      <FadeIn delay={0.1}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <EditTripForm trip={trip} />
        </div>
      </FadeIn>

    </div>
  );
}
