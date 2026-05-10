"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ActivityTemplate } from "@/lib/activities-data";
import { ActivityCard } from "./activity-card";

interface Stop {
  id: string;
  cityName: string;
  tripId: string;
}

interface ActivitiesClientProps {
  activities: ActivityTemplate[];
  stops: Stop[];
}

export function ActivitiesClient({ activities, stops }: ActivitiesClientProps) {
  // Track which activities have been added to which stops
  const [addedMap, setAddedMap] = useState<Record<string, Set<string>>>({});

  function handleAdded(stopId: string, activityId: string) {
    setAddedMap((prev) => {
      const next = { ...prev };
      if (!next[activityId]) next[activityId] = new Set();
      next[activityId] = new Set([...next[activityId], stopId]);
      return next;
    });
  }

  return (
    <AnimatePresence mode="wait">
      {activities.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 py-20 text-center"
        >
          <span className="mb-4 text-5xl">🔍</span>
          <h3 className="mb-2 text-lg font-bold text-foreground">No activities found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {activities.map((activity, i) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={i}
              stops={stops}
              addedStopIds={addedMap[activity.id] ?? new Set()}
              onAdded={handleAdded}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
