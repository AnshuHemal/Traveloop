"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, Calendar, DollarSign, Globe, Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    visibility: string;
    currency: string;
    startDate: Date | null;
    endDate: Date | null;
    _count: { stops: number };
    stops: { cityName: string; countryName: string }[];
  };
  index: number;
}

const STATUS_CONFIG = {
  DRAFT:     { label: "Draft",     color: "bg-muted text-muted-foreground" },
  PLANNED:   { label: "Planned",   color: "bg-primary/10 text-primary" },
  ONGOING:   { label: "Ongoing",   color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  COMPLETED: { label: "Completed", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
} as const;

const DESTINATION_EMOJIS: Record<string, string> = {
  France: "🗼", Italy: "🏛️", Spain: "🎨", Portugal: "🌊",
  Japan: "🗾", Thailand: "🏯", Greece: "🏛️", Germany: "🏰",
  USA: "🗽", UK: "🎡", Australia: "🦘", India: "🕌",
};

export function TripCard({ trip, index }: TripCardProps) {
  const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const firstStop = trip.stops[0];
  const emoji = firstStop ? (DESTINATION_EMOJIS[firstStop.countryName] ?? "✈️") : "✈️";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/trips/${trip.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">

          {/* Card header with gradient */}
          <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <span className="text-5xl">{emoji}</span>
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status.color)}>
                {status.label}
              </span>
              {trip.visibility === "PUBLIC" ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground">
                  <Globe className="size-3" />
                </span>
              ) : trip.visibility === "SHARED" ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground">
                  <Users className="size-3" />
                </span>
              ) : (
                <span className="flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground">
                  <Lock className="size-3" />
                </span>
              )}
            </div>
          </div>

          {/* Card body */}
          <div className="p-5">
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {trip.title}
            </h3>

            {trip.description && (
              <p className="mb-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {trip._count.stops > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />
                  {trip._count.stops} {trip._count.stops === 1 ? "stop" : "stops"}
                </span>
              )}
              {trip.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-primary" />
                  {format(new Date(trip.startDate), "MMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <DollarSign className="size-3 text-primary" />
                {trip.currency}
              </span>
            </div>

            {/* Stops preview */}
            {trip.stops.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {trip.stops.slice(0, 3).map((stop) => (
                  <Badge
                    key={stop.cityName}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {stop.cityName}
                  </Badge>
                ))}
                {trip.stops.length > 3 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    +{trip.stops.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
