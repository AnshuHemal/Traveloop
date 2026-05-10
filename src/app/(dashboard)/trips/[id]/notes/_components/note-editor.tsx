"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, FileText, Tag, Calendar, Pin,
  Save, Loader2, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createNote, updateNote, type NoteState } from "../actions";

const NOTE_COLORS = [
  { value: "DEFAULT", label: "Default", bg: "bg-card",          border: "border-border",         dot: "bg-muted-foreground/40" },
  { value: "YELLOW",  label: "Yellow",  bg: "bg-yellow-500/10", border: "border-yellow-500/30",  dot: "bg-yellow-400" },
  { value: "GREEN",   label: "Green",   bg: "bg-emerald-500/10",border: "border-emerald-500/30", dot: "bg-emerald-400" },
  { value: "BLUE",    label: "Blue",    bg: "bg-sky-500/10",    border: "border-sky-500/30",     dot: "bg-sky-400" },
  { value: "PINK",    label: "Pink",    bg: "bg-rose-500/10",   border: "border-rose-500/30",    dot: "bg-rose-400" },
  { value: "PURPLE",  label: "Purple",  bg: "bg-violet-500/10", border: "border-violet-500/30",  dot: "bg-violet-400" },
] as const;

interface Stop { id: string; cityName: string }

interface NoteEditorProps {
  tripId: string;
  stops: Stop[];
  open: boolean;
  onClose: () => void;
  editNote?: {
    id: string;
    title: string;
    content: string;
    color: string;
    pinned: boolean;
    stopId: string | null;
    date: Date | null;
  } | null;
}

const initialState: NoteState = {};

export function NoteEditor({ tripId, stops, open, onClose, editNote }: NoteEditorProps) {
  const isEdit = !!editNote;
  const action = isEdit ? updateNote : createNote;
  const [state, formAction] = useActionState(action, initialState);

  const [color, setColor]   = useState(editNote?.color ?? "DEFAULT");
  const [pinned, setPinned] = useState(editNote?.pinned ?? false);
  const titleRef = useRef<HTMLInputElement>(null);
  const formRef  = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) { formRef.current?.reset(); onClose(); }
  }, [state.success, onClose]);

  useEffect(() => {
    if (open) {
      setColor(editNote?.color ?? "DEFAULT");
      setPinned(editNote?.pinned ?? false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, editNote]);

  const colorCfg = NOTE_COLORS.find((c) => c.value === color) ?? NOTE_COLORS[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              "fixed inset-x-4 top-[8%] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full",
              colorCfg.border, colorCfg.bg,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  {isEdit ? "Edit note" : "New note"}
                </h2>
              </div>
              <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <form ref={formRef} action={formAction} className="max-h-[75vh] overflow-y-auto p-6">
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="color" value={color} />
              <input type="hidden" name="pinned" value={String(pinned)} />
              {isEdit && <input type="hidden" name="noteId" value={editNote!.id} />}

              <div className="flex flex-col gap-5">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="noteTitle" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    ref={titleRef}
                    id="noteTitle"
                    name="title"
                    placeholder="e.g. Hotel check-in details"
                    defaultValue={editNote?.title}
                    required
                    className="h-11"
                  />
                  {state.errors?.title && <p className="text-xs text-destructive">{state.errors.title[0]}</p>}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="noteContent" className="text-sm font-semibold">
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="noteContent"
                    name="content"
                    placeholder="Write your note here…"
                    defaultValue={editNote?.content}
                    required
                    className="min-h-[120px] resize-none text-sm"
                  />
                  {state.errors?.content && <p className="text-xs text-destructive">{state.errors.content[0]}</p>}
                </div>

                {/* Stop + Date row */}
                <div className="grid grid-cols-2 gap-3">
                  {stops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="noteStop" className="text-sm font-semibold">
                        <Tag className="size-3.5 text-primary" />
                        Link to stop
                      </Label>
                      <select
                        id="noteStop"
                        name="stopId"
                        defaultValue={editNote?.stopId ?? ""}
                        className={cn(
                          "h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 text-sm outline-none transition-[color,box-shadow]",
                          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
                        )}
                      >
                        <option value="">— Trip-level —</option>
                        {stops.map((s) => (
                          <option key={s.id} value={s.id}>{s.cityName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="noteDate" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Date
                    </Label>
                    <Input
                      id="noteDate"
                      name="date"
                      type="date"
                      defaultValue={editNote?.date ? format(new Date(editNote.date), "yyyy-MM-dd") : ""}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Color picker */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">Note color</Label>
                  <div className="flex gap-2">
                    {NOTE_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        title={c.label}
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border-2 transition-all",
                          color === c.value ? "border-foreground scale-110" : "border-transparent hover:scale-105",
                        )}
                      >
                        <span className={cn("size-5 rounded-full", c.dot)} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pin toggle */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div
                    onClick={() => setPinned((v) => !v)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors",
                      pinned ? "bg-primary" : "bg-muted",
                    )}
                  >
                    <motion.div
                      animate={{ x: pinned ? 16 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 size-4 rounded-full bg-white shadow"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Pin className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Pin this note</span>
                  </div>
                </label>

                {state.message && (
                  <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                    {state.message}
                  </p>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                    Cancel
                  </button>
                  <button type="submit" className={cn(buttonVariants(), "flex-1 gap-2")}>
                    <Save className="size-4" />
                    {isEdit ? "Save changes" : "Add note"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
