"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Zap, Calendar, Clock, DollarSign,
  FileText, Save, Loader2, Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { updateActivity } from "../actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const CATEGORIES = [
  { value: "SIGHTSEEING",   label: "Sightseeing",   emoji: "🏛️" },
  { value: "FOOD",          label: "Food",          emoji: "🍜" },
  { value: "TRANSPORT",     label: "Transport",     emoji: "✈️" },
  { value: "ACCOMMODATION", label: "Hotel",         emoji: "🏨" },
  { value: "ADVENTURE",     label: "Adventure",     emoji: "🧗" },
  { value: "CULTURE",       label: "Culture",       emoji: "🎭" },
  { value: "SHOPPING",      label: "Shopping",      emoji: "🛍️" },
  { value: "NIGHTLIFE",     label: "Nightlife",     emoji: "🌃" },
  { value: "WELLNESS",      label: "Wellness",      emoji: "🧘" },
  { value: "OTHER",         label: "Other",         emoji: "📌" },
];

interface EditActivityModalProps {
  activity: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    date: Date | null;
    startTime: string | null;
    endTime: string | null;
    cost: number;
    booked: boolean;
  };
  tripId: string;
  stopName: string;
  open: boolean;
  onClose: () => void;
}

const fmtDate = (d: Date | null) =>
  d ? format(new Date(d), "yyyy-MM-dd") : "";

export function EditActivityModal({
  activity, tripId, stopName, open, onClose,
}: EditActivityModalProps) {
  const [isPending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);

  const [name,        setName]        = useState(activity.name);
  const [description, setDescription] = useState(activity.description ?? "");
  const [category,    setCategory]    = useState(activity.category);
  const [date,        setDate]        = useState(fmtDate(activity.date));
  const [startTime,   setStartTime]   = useState(activity.startTime ?? "");
  const [endTime,     setEndTime]     = useState(activity.endTime ?? "");
  const [cost,        setCost]        = useState(String(activity.cost));
  const [booked,      setBooked]      = useState(activity.booked);

  useEffect(() => {
    setName(activity.name);
    setDescription(activity.description ?? "");
    setCategory(activity.category);
    setDate(fmtDate(activity.date));
    setStartTime(activity.startTime ?? "");
    setEndTime(activity.endTime ?? "");
    setCost(String(activity.cost));
    setBooked(activity.booked);
  }, [activity]);

  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 100);
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.set("activityId",  activity.id);
    formData.set("tripId",      tripId);
    formData.set("name",        name.trim());
    formData.set("description", description.trim());
    formData.set("category",    category);
    formData.set("date",        date);
    formData.set("startTime",   startTime);
    formData.set("endTime",     endTime);
    formData.set("cost",        cost);
    formData.set("booked",      String(booked));

    startTransition(async () => {
      const result = await updateActivity({} as never, formData);
      if (result.message) {
        toast.error(result.message);
      } else if (result.success) {
        toast.success(`"${name}" updated!`);
        onClose();
      }
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[8%] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Edit activity</h2>
                  <p className="text-xs text-muted-foreground">in {stopName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {}
            <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6">
              <div className="flex flex-col gap-5">

                {}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editActName" className="text-sm font-semibold">
                    <Zap className="size-3.5 text-primary" />
                    Activity name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    ref={nameRef}
                    id="editActName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isPending}
                    className="h-11"
                  />
                </div>

                {}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">
                    <Tag className="size-3.5 text-primary" />
                    Category
                  </Label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        disabled={isPending}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 bg-muted/50 p-2 text-center transition-all",
                          category === cat.value
                            ? "border-primary bg-primary/8"
                            : "border-transparent hover:border-border hover:bg-muted",
                        )}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="text-[9px] font-medium text-muted-foreground leading-tight">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editActDate" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Date
                    </Label>
                    <Input
                      id="editActDate"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={isPending}
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editActStart" className="text-sm font-semibold">
                      <Clock className="size-3.5 text-primary" />
                      Start
                    </Label>
                    <Input
                      id="editActStart"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      disabled={isPending}
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editActEnd" className="text-sm font-semibold">
                      <Clock className="size-3.5 text-primary" />
                      End
                    </Label>
                    <Input
                      id="editActEnd"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={isPending}
                      className="h-11"
                    />
                  </div>
                </div>

                {}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editActCost" className="text-sm font-semibold">
                    <DollarSign className="size-3.5 text-primary" />
                    Estimated cost
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      id="editActCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      disabled={isPending}
                      className="h-11 pl-7"
                    />
                  </div>
                </div>

                {}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editActDesc" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Notes
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="editActDesc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Booking reference, tips…"
                    disabled={isPending}
                    className="min-h-[64px] resize-none text-sm"
                  />
                </div>

                {}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div
                    onClick={() => setBooked((v) => !v)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors",
                      booked ? "bg-primary" : "bg-muted",
                    )}
                  >
                    <motion.div
                      animate={{ x: booked ? 16 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 size-4 rounded-full bg-white shadow"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">Already booked</span>
                </label>

                {}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !name.trim()}
                    className={cn(buttonVariants(), "flex-1 gap-2")}
                  >
                    {isPending ? (
                      <><Loader2 className="size-4 animate-spin" /> Saving…</>
                    ) : (
                      <><Save className="size-4" /> Save changes</>
                    )}
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
