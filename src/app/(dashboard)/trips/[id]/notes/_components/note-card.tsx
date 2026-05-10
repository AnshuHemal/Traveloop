"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import {
  Pin, PinOff, Pencil, Trash2, Loader2,
  MapPin, Calendar, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { deleteNote, toggleNotePin } from "../actions";

const COLOR_STYLES: Record<string, { card: string; header: string; badge: string }> = {
  DEFAULT: { card: "border-border bg-card",           header: "bg-muted/30",          badge: "bg-muted text-muted-foreground" },
  YELLOW:  { card: "border-yellow-500/30 bg-yellow-500/8",  header: "bg-yellow-500/15",     badge: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  GREEN:   { card: "border-emerald-500/30 bg-emerald-500/8",header: "bg-emerald-500/15",    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  BLUE:    { card: "border-sky-500/30 bg-sky-500/8",        header: "bg-sky-500/15",        badge: "bg-sky-500/15 text-sky-700 dark:text-sky-400" },
  PINK:    { card: "border-rose-500/30 bg-rose-500/8",      header: "bg-rose-500/15",       badge: "bg-rose-500/15 text-rose-700 dark:text-rose-400" },
  PURPLE:  { card: "border-violet-500/30 bg-violet-500/8",  header: "bg-violet-500/15",     badge: "bg-violet-500/15 text-violet-700 dark:text-violet-400" },
};

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    color: string;
    pinned: boolean;
    date: Date | null;
    createdAt: Date;
    updatedAt: Date;
    stopId: string | null;
    stop: { cityName: string } | null;
  };
  tripId: string;
  index: number;
  onEdit: () => void;
}

export function NoteCard({ note, tripId, index, onEdit }: NoteCardProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"pin" | "delete" | null>(null);
  const styles = COLOR_STYLES[note.color] ?? COLOR_STYLES.DEFAULT;

  function handlePin() {
    setPendingAction("pin");
    startTransition(async () => {
      const result = await toggleNotePin(note.id, tripId, !note.pinned);
      if (result.error) toast.error(result.error);
      setPendingAction(null);
    });
  }

  function handleDelete() {
    setPendingAction("delete");
    startTransition(async () => {
      const result = await deleteNote(note.id, tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Note deleted");
      setPendingAction(null);
    });
  }

  const isEdited = note.updatedAt.getTime() - note.createdAt.getTime() > 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      layout
      className={cn(
        "group overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-lg",
        styles.card,
        note.pinned && "ring-1 ring-primary/30",
      )}
    >
      {}
      <div className={cn("flex items-start justify-between gap-3 px-4 py-3", styles.header)}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            {note.pinned && (
              <Pin className="size-3.5 shrink-0 text-primary" />
            )}
            <h3 className="font-bold text-foreground leading-tight line-clamp-1">
              {note.title}
            </h3>
          </div>

          {}
          <div className="flex flex-wrap items-center gap-1.5">
            {note.stop && (
              <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", styles.badge)}>
                <MapPin className="size-2.5" />
                {note.stop.cityName}
              </span>
            )}
            {note.date && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Calendar className="size-2.5" />
                {format(new Date(note.date), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        {}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handlePin}
            disabled={isPending}
            title={note.pinned ? "Unpin" : "Pin"}
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors",
              note.pinned
                ? "text-primary hover:bg-primary/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {pendingAction === "pin" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : note.pinned ? (
              <PinOff className="size-3.5" />
            ) : (
              <Pin className="size-3.5" />
            )}
          </button>
          <button
            onClick={onEdit}
            title="Edit note"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            title="Delete note"
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            {pendingAction === "delete" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {}
      <div className="px-4 py-3">
        <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed line-clamp-4">
          {note.content}
        </p>
      </div>

      {}
      <div className="flex items-center justify-between border-t border-border/40 px-4 py-2">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="size-2.5" />
          {isEdited ? "Edited " : ""}
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        {note.content.length > 200 && (
          <button
            onClick={onEdit}
            className="text-[10px] font-medium text-primary hover:underline"
          >
            Read more
          </button>
        )}
      </div>
    </motion.div>
  );
}
