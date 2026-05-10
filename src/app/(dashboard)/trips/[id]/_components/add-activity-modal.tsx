"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Zap, Calendar, Clock, DollarSign,
  FileText, CheckCircle2, Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { addActivity, type AddActivityState } from "../actions";
import { cn } from "@/lib/utils";

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

interface AddActivityModalProps {
  stopId: string;
  tripId: string;
  stopName: string;
  open: boolean;
  onClose: () => void;
}

const initialState: AddActivityState = {};

export function AddActivityModal({
  stopId, tripId, stopName, open, onClose,
}: AddActivityModalProps) {
  const [state, formAction] = useActionState(addActivity, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onClose();
    }
  }, [state.success, onClose]);

  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 100);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[8%] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Add activity</h2>
                  <p className="text-xs text-muted-foreground">to {stopName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} action={formAction} className="max-h-[75vh] overflow-y-auto p-6">
              <input type="hidden" name="stopId" value={stopId} />
              <input type="hidden" name="tripId" value={tripId} />

              <div className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="actName" className="text-sm font-semibold">
                    <Zap className="size-3.5 text-primary" />
                    Activity name
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    ref={nameRef}
                    id="actName"
                    name="name"
                    placeholder="e.g. Eiffel Tower visit"
                    required
                    className="h-11"
                  />
                  {state.errors?.name && (
                    <p className="text-xs text-destructive">{state.errors.name[0]}</p>
                  )}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">
                    <Tag className="size-3.5 text-primary" />
                    Category
                  </Label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className="group cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          defaultChecked={cat.value === "SIGHTSEEING"}
                          className="peer sr-only"
                        />
                        <div className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 border-transparent bg-muted/50 p-2 text-center transition-all",
                          "peer-checked:border-primary peer-checked:bg-primary/8",
                          "hover:border-border hover:bg-muted",
                        )}>
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="text-[9px] font-medium text-muted-foreground leading-tight">
                            {cat.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date + Times */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="actDate" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Date
                    </Label>
                    <Input id="actDate" name="date" type="date" className="h-11" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="startTime" className="text-sm font-semibold">
                      <Clock className="size-3.5 text-primary" />
                      Start
                    </Label>
                    <Input id="startTime" name="startTime" type="time" className="h-11" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="endTime" className="text-sm font-semibold">
                      <Clock className="size-3.5 text-primary" />
                      End
                    </Label>
                    <Input id="endTime" name="endTime" type="time" className="h-11" />
                  </div>
                </div>

                {/* Cost */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cost" className="text-sm font-semibold">
                    <DollarSign className="size-3.5 text-primary" />
                    Estimated cost
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="0"
                      className="h-11 pl-7"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="actDesc" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Notes
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="actDesc"
                    name="description"
                    placeholder="Booking reference, tips, reminders…"
                    className="min-h-[64px] resize-none text-sm"
                  />
                </div>

                {/* Booked toggle */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <input type="checkbox" name="booked" value="true" className="peer sr-only" />
                  <div className={cn(
                    "relative h-5 w-9 rounded-full bg-muted transition-colors",
                    "peer-checked:bg-primary",
                  )}>
                    <div className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Already booked</span>
                </label>

                {/* Error */}
                {state.message && (
                  <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                    {state.message}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={cn(buttonVariants(), "flex-1 gap-2")}>
                    <CheckCircle2 className="size-4" />
                    Add activity
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
