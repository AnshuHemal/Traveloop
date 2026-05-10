import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { TripHeader } from "./_components/trip-header";
import { TripNavTabs } from "./_components/trip-nav-tabs";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function TripLayout({ children, params }: LayoutProps) {
  const user = await requireUser();
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id:          true,
      title:       true,
      description: true,
      status:      true,
      visibility:  true,
      currency:    true,
      startDate:   true,
      endDate:     true,
      userId:      true,
      _count:      { select: { stops: true } },
    },
  });

  if (!trip) notFound();
  if (trip.userId !== user.id) notFound();

  return (
    <div className="flex flex-col gap-0 pb-16">
      {}
      <FadeIn direction="down">
        <TripHeader trip={trip} />
      </FadeIn>

      {}
      <FadeIn delay={0.08}>
        <div className="mt-6">
          <TripNavTabs tripId={trip.id} stopCount={trip._count.stops} />
        </div>
      </FadeIn>

      {}
      <FadeIn delay={0.12}>
        <div className="mt-6">
          {children}
        </div>
      </FadeIn>
    </div>
  );
}
