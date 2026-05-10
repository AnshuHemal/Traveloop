"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  MapPin, Calendar, DollarSign, Globe, Lock,
  Users, ArrowRight, Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { TripActionsMenu } from "./trip-actions-menu";

interface TripListItemProps {
  trip: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    visibility: string;
    currency: string;
    startDate: Date | null;
    endDate: Date | null;
    updatedAt: Date;
    _count: { stops: number };
    stops: { cityName: string; countryName: string }[];
  };
  index: number;
}

const STATUS_CONFIG = {
  DRAFT:     { label: "Draft",     color: "bg-muted text-muted-foreground",                           dot: "bg-muted-foreground/60" },
  PLANNED:   { label: "Planned",   color: "bg-primary/10 text-primary",                               dot: "bg-primary" },
  ONGOING:   { label: "Ongoing",   color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  COMPLETED: { label: "Completed", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",    dot: "bg-violet-500" },
} as const;

const DESTINATION_EMOJIS: Record<string, string> = {
  France: "🗼", Italy: "🏛️", Spain: "🎨", Portugal: "🌊",
  Japan: "🗾", Thailand: "🏯", Greece: "🏝️", Germany: "🏰",
  USA: "🗽", UK: "🎡", Australia: "🦘", India: "🕌",
  Indonesia: "🌴", UAE: "🏙️", Mexico: "🌮", Brazil: "🌿",
};

const GRADIENT_MAP: Record<string, string> = {
  DRAFT:     "from-muted/80 to-muted/40",
  PLANNED:   "from-primary/20 to-primary/8",
  ONGOING:   "from-emerald-500/20 to-emerald-500/8",
  COMPLETED: "from-violet-500/20 to-violet-500/8",
};

export function TripListItem({ trip, index }: TripListItemProps) {
  const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const firstStop = trip.stops[0];
  const emoji = firstStop ? (DESTINATION_EMOJIS[firstStop.countryName] ?? "✈️") : "✈️";
  const gradient = GRADIENT_MAP[trip.status] ?? GRADIENT_MAP.DRAFT;

  const dateRange = trip.startDate && trip.endDate
    ? `${format(new Date(trip.startDate), "MMM d")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`
    : trip.startDate
      ? `From ${format(new Date(trip.startDate), "MMM d, yyyy")}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">

        {}
        <Link href={`/trips/${trip.id}`} className="shrink-0">
          <div className={cn(
            "flex size-14 items-center justify-center rounded-xl bg-linear-to-br text-2xl transition-transform duration-200 group-hover:scale-105",
            gradient,
          )}>
            {emoji}
          </div>
        </Link>

        {}
        <Link href={`/trips/${trip.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
          {}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {trip.title}
            </h3>
            <span className={cn(
              "hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold sm:flex",
              status.color,
            )}>
              <span className={cn("size-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>
          </div>

          {}
          {trip.description && (
            <p className="hidden text-xs text-muted-foreground line-clamp-1 sm:block">
              {trip.description}
            </p>
          )}

          {}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {trip._count.stops > 0 && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3 text-primary" />
                {trip._count.stops} {trip._count.stops === 1 ? "stop" : "stops"}
              </span>
            )}
            {dateRange && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                {dateRange}
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign className="size-3 text-primary" />
              {trip.currency}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDistanceToNow(new Date(trip.updatedAt), { addSuffix: true })}
            </span>
          </div>

          {}
          {trip.stops.length > 0 && (
            <div className="hidden flex-wrap gap-1 sm:flex">
              {trip.stops.slice(0, 4).map((stop) => (
                <Badge key={stop.cityName} variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  {stop.cityName}
                </Badge>
              ))}
              {trip.stops.length > 4 && (
                <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  +{trip.stops.length - 4}
                </Badge>
              )}
            </div>
          )}
        </Link>

        {}
        <div className="flex shrink-0 items-center gap-2">
          {}
          <span className="hidden size-7 items-center justify-center rounded-lg border border-border text-muted-foreground sm:flex">
            {trip.visibility === "PUBLIC" ? (
              <Globe className="size-3.5" />
            ) : trip.visibility === "SHARED" ? (
              <Users className="size-3.5" />
            ) : (
              <Lock className="size-3.5" />
            )}
          </span>

          {}
          <Link
            href={`/trips/${trip.id}`}
            className="hidden items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all sm:flex"
          >
            View
            <ArrowRight className="size-3" />
          </Link>

          {}
          <TripActionsMenu trip={trip} />
        </div>
      </div>
    </motion.div>
  );
}
