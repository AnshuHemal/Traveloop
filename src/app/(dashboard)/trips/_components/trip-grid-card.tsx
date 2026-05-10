"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  MapPin, Calendar, DollarSign, Globe, Lock, Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { TripActionsMenu } from "./trip-actions-menu";

interface TripGridCardProps {
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
  DRAFT:     "from-muted/80 via-muted/40 to-transparent",
  PLANNED:   "from-primary/20 via-primary/10 to-transparent",
  ONGOING:   "from-emerald-500/20 via-emerald-500/10 to-transparent",
  COMPLETED: "from-violet-500/20 via-violet-500/10 to-transparent",
};

export function TripGridCard({ trip, index }: TripGridCardProps) {
  const status = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const firstStop = trip.stops[0];
  const emoji = firstStop ? (DESTINATION_EMOJIS[firstStop.countryName] ?? "✈️") : "✈️";
  const gradient = GRADIENT_MAP[trip.status] ?? GRADIENT_MAP.DRAFT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8">

        {}
        <Link href={`/trips/${trip.id}`} className="block">
          <div className={cn("relative flex h-32 items-center justify-center bg-linear-to-br", gradient)}>
            <motion.span
              className="text-5xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {emoji}
            </motion.span>

            {}
            <div className="absolute left-3 top-3">
              <span className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                status.color,
              )}>
                <span className={cn("size-1.5 rounded-full", status.dot)} />
                {status.label}
              </span>
            </div>

            {}
            <div className="absolute right-3 top-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm">
                {trip.visibility === "PUBLIC" ? (
                  <Globe className="size-3" />
                ) : trip.visibility === "SHARED" ? (
                  <Users className="size-3" />
                ) : (
                  <Lock className="size-3" />
                )}
              </span>
            </div>
          </div>
        </Link>

        {}
        <div className="flex flex-1 flex-col p-4">
          {}
          <div className="mb-1 flex items-start justify-between gap-2">
            <Link href={`/trips/${trip.id}`} className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-sm">
                {trip.title}
              </h3>
            </Link>
            <TripActionsMenu trip={trip} />
          </div>

          {}
          {trip.description && (
            <p className="mb-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}

          {}
          <div className="mt-auto flex flex-wrap gap-2 text-xs text-muted-foreground">
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

          {}
          {trip.stops.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {trip.stops.slice(0, 3).map((stop) => (
                <Badge key={stop.cityName} variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  {stop.cityName}
                </Badge>
              ))}
              {trip.stops.length > 3 && (
                <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  +{trip.stops.length - 3}
                </Badge>
              )}
            </div>
          )}

          {}
          <p className="mt-2.5 text-[10px] text-muted-foreground/60">
            Updated {formatDistanceToNow(new Date(trip.updatedAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
