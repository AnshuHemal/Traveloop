"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, X, SlidersHorizontal,
  ChevronDown, FileText, Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";

interface Note {
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
}

interface Stop { id: string; cityName: string }

interface NotesClientProps {
  tripId: string;
  notes: Note[];
  stops: Stop[];
}

export function NotesClient({ tripId, notes, stops }: NotesClientProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterStop, setFilterStop] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "pinned" | "date">("newest");
  const [groupBy, setGroupBy] = useState<"none" | "stop" | "date">("none");
  const searchRef = useRef<HTMLInputElement>(null);

  function openCreate() { setEditNote(null); setShowEditor(true); }
  function openEdit(note: Note) { setEditNote(note); setShowEditor(true); }
  function closeEditor() { setShowEditor(false); setEditNote(null); }

  let filtered = notes.filter((n) => {
    if (filterStop !== "ALL") {
      if (filterStop === "TRIP" && n.stopId !== null) return false;
      if (filterStop !== "TRIP" && n.stopId !== filterStop) return false;
    }
    if (searchQ && !n.title.toLowerCase().includes(searchQ.toLowerCase()) &&
        !n.content.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "pinned") {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    }
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "date") {
      if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (a.date) return -1;
      if (b.date) return 1;
    }

    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  let groups: { label: string; notes: Note[] }[] = [];
  if (groupBy === "stop") {
    const tripLevel = filtered.filter((n) => !n.stopId);
    const byStop = stops.map((s) => ({
      label: s.cityName,
      notes: filtered.filter((n) => n.stopId === s.id),
    })).filter((g) => g.notes.length > 0);
    if (tripLevel.length > 0) groups.push({ label: "Trip-level notes", notes: tripLevel });
    groups = [...groups, ...byStop];
  } else if (groupBy === "date") {
    const withDate    = filtered.filter((n) => n.date);
    const withoutDate = filtered.filter((n) => !n.date);
    const dateMap = new Map<string, Note[]>();
    for (const n of withDate) {
      const key = new Date(n.date!).toDateString();
      if (!dateMap.has(key)) dateMap.set(key, []);
      dateMap.get(key)!.push(n);
    }
    for (const [key, ns] of dateMap) {
      groups.push({ label: key, notes: ns });
    }
    if (withoutDate.length > 0) groups.push({ label: "No date", notes: withoutDate });
  } else {
    groups = [{ label: "", notes: filtered }];
  }

  const pinnedCount = notes.filter((n) => n.pinned).length;

  return (
    <>
      <div className="flex flex-col gap-6">

        {}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-3"
        >
          {}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search notes…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-sm outline-none transition-[color,box-shadow]",
                  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
                )}
              />
              {searchQ && (
                <button onClick={() => setSearchQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Plus className="size-4" />
              Add note
            </button>
          </div>

          {}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />

            {}
            <div className="relative">
              <select value={filterStop} onChange={(e) => setFilterStop(e.target.value)}
                className={cn(
                  "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium outline-none",
                  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30",
                  filterStop !== "ALL" && "border-primary/40 bg-primary/5 text-primary",
                )}>
                <option value="ALL">All notes</option>
                <option value="TRIP">Trip-level only</option>
                {stops.map((s) => <option key={s.id} value={s.id}>{s.cityName}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            </div>

            {}
            <div className="relative">
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as typeof groupBy)}
                className="h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30">
                <option value="none">No grouping</option>
                <option value="stop">Group by stop</option>
                <option value="date">Group by date</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            </div>

            {}
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="pinned">Pinned first</option>
                <option value="date">By note date</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            </div>

            {}
            <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
              {pinnedCount > 0 && (
                <span className="flex items-center gap-1">
                  <Pin className="size-3 text-primary" />
                  {pinnedCount} pinned
                </span>
              )}
              <span>{filtered.length} note{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </motion.div>

        {}
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-border bg-card/40 py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="flex size-20 items-center justify-center rounded-2xl bg-primary/10"
            >
              <FileText className="size-10 text-primary" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No notes yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                Jot down hotel details, local contacts, reminders, or anything you don&apos;t want to forget.
              </p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="size-4" /> Write your first note
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border py-12 text-center">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-muted-foreground">No notes match your search</p>
          </motion.div>
        ) : (

          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {groups.map((group) => (
                <div key={group.label} className="flex flex-col gap-3">
                  {group.label && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-sm font-bold text-foreground">{group.label}</span>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">{group.notes.length}</span>
                    </motion.div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {group.notes.map((note, i) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          tripId={tripId}
                          index={i}
                          onEdit={() => openEdit(note)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {}
      <NoteEditor
        tripId={tripId}
        stops={stops}
        open={showEditor}
        onClose={closeEditor}
        editNote={editNote}
      />
    </>
  );
}
