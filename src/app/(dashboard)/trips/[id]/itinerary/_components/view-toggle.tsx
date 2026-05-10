"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { motion } from "motion/react";
import { List, CalendarDays, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "timeline", label: "Timeline", icon: GitBranch },
  { id: "list",     label: "List",     icon: List },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
] as const;

type ViewId = typeof VIEWS[number]["id"];

interface ViewToggleProps {
  current: ViewId;
}

export function ViewToggle({ current }: ViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setView(v: ViewId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", v);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-muted/30 p-0.5">
      {VIEWS.map((v) => {
        const active = current === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.div
                layoutId="view-pill"
                className="absolute inset-0 rounded-lg bg-background shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <v.icon className="relative size-3.5" />
            <span className="relative hidden sm:inline">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
