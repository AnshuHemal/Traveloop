"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard, Map, DollarSign, Share2, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TripNavTabsProps {
  tripId: string;
  stopCount: number;
}

export function TripNavTabs({ tripId, stopCount }: TripNavTabsProps) {
  const pathname = usePathname();

  const TABS = [
    {
      label:  "Overview",
      href:   `/trips/${tripId}`,
      icon:   LayoutDashboard,
      exact:  true,
    },
    {
      label:  "Itinerary",
      href:   `/trips/${tripId}/itinerary`,
      icon:   Map,
      badge:  stopCount > 0 ? stopCount : undefined,
    },
    {
      label:  "Budget",
      href:   `/trips/${tripId}/budget`,
      icon:   DollarSign,
    },
    {
      label:  "Share",
      href:   `/trips/${tripId}/share`,
      icon:   Share2,
    },
    {
      label:  "Edit",
      href:   `/trips/${tripId}/edit`,
      icon:   Pencil,
    },
  ] as const;

  function isActive(tab: { href: string; exact?: boolean }) {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  }

  return (
    <div className="relative">
      {/* Scrollable tab bar */}
      <div className="flex overflow-x-auto border-b border-border scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-0">
          {TABS.map((tab) => {
            const active = isActive(tab);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="size-4 shrink-0" />
                {tab.label}
                {"badge" in tab && tab.badge !== undefined && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-bold text-primary">
                    {tab.badge}
                  </span>
                )}

                {/* Active underline */}
                {active && (
                  <motion.div
                    layoutId="trip-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
