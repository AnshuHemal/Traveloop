"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateTripStatus } from "../../trips/[id]/actions";

interface StatusNudgeProps {
  trips: { id: string; title: string }[];
}

export function StatusNudge({ trips }: StatusNudgeProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const visible = trips.filter((t) => !dismissed.includes(t.id));
  if (visible.length === 0) return null;

  function handleMark(tripId: string, title: string) {
    setPendingId(tripId);
    startTransition(async () => {
      const result = await updateTripStatus(tripId, "COMPLETED");
      if (result.error) toast.error(result.error);
      else {
        toast.success(`"${title}" marked as completed!`);
        setDismissed((d) => [...d, tripId]);
      }
      setPendingId(null);
    });
  }

  return (
    <AnimatePresence>
      {visible.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          {visible.map((trip) => (
            <motion.div
              key={trip.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/8 px-4 py-3"
            >
              <CheckCircle2 className="size-4 shrink-0 text-violet-500" />
              <p className="flex-1 text-sm text-foreground">
                <span className="font-semibold">&ldquo;{trip.title}&rdquo;</span> has ended — mark it as completed?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMark(trip.id, trip.title)}
                  disabled={isPending}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-600 transition-colors",
                    "disabled:opacity-60",
                  )}
                >
                  {pendingId === trip.id ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3" />
                  )}
                  Mark done
                </button>
                <button
                  onClick={() => setDismissed((d) => [...d, trip.id])}
                  className="flex size-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
