"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, DollarSign, Tag, FileText, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addExpense, type AddExpenseState } from "../actions";

const EXPENSE_CATEGORIES = [
  { value: "ACCOMMODATION", label: "Accommodation", emoji: "🏨" },
  { value: "FOOD",          label: "Food",          emoji: "🍜" },
  { value: "TRANSPORT",     label: "Transport",     emoji: "✈️" },
  { value: "ACTIVITIES",    label: "Activities",    emoji: "🎭" },
  { value: "SHOPPING",      label: "Shopping",      emoji: "🛍️" },
  { value: "VISA",          label: "Visa",          emoji: "📋" },
  { value: "INSURANCE",     label: "Insurance",     emoji: "🛡️" },
  { value: "MISC",          label: "Other",         emoji: "📌" },
];

interface Stop {
  id: string;
  cityName: string;
}

interface AddExpenseModalProps {
  tripId: string;
  stops: Stop[];
  open: boolean;
  onClose: () => void;
}

const initialState: AddExpenseState = {};

export function AddExpenseModal({ tripId, stops, open, onClose }: AddExpenseModalProps) {
  const [state, formAction] = useActionState(addExpense, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) { formRef.current?.reset(); onClose(); }
  }, [state.success, onClose]);

  useEffect(() => {
    if (open) setTimeout(() => labelRef.current?.focus(), 100);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[12%] z-50 mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="size-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">Add expense</h2>
              </div>
              <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <form ref={formRef} action={formAction} className="p-6">
              <input type="hidden" name="tripId" value={tripId} />
              <div className="flex flex-col gap-4">

                {/* Stop selector */}
                {stops.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                      <Tag className="size-3.5 text-primary" />
                      Stop (optional)
                    </Label>
                    <select
                      name="stopId"
                      className={cn(
                        "h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 text-sm outline-none transition-[color,box-shadow]",
                        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
                      )}
                    >
                      <option value="">— General trip expense —</option>
                      {stops.map((s) => (
                        <option key={s.id} value={s.id}>{s.cityName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">
                    <Tag className="size-3.5 text-primary" />
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <label key={cat.value} className="cursor-pointer">
                        <input type="radio" name="category" value={cat.value} defaultChecked={cat.value === "MISC"} className="peer sr-only" />
                        <div className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 border-transparent bg-muted/50 p-2 text-center transition-all",
                          "peer-checked:border-primary peer-checked:bg-primary/8",
                          "hover:border-border hover:bg-muted",
                        )}>
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="text-[9px] font-medium text-muted-foreground leading-tight">{cat.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Label */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="expLabel" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Input ref={labelRef} id="expLabel" name="label" placeholder="e.g. Hotel booking, Flight tickets…" required className="h-11" />
                  {state.errors?.label && <p className="text-xs text-destructive">{state.errors.label[0]}</p>}
                </div>

                {/* Amount + Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="amount" className="text-sm font-semibold">
                      <DollarSign className="size-3.5 text-primary" />
                      Amount <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input id="amount" name="amount" type="number" min="0" step="0.01" defaultValue="0" required className="h-11 pl-7" />
                    </div>
                    {state.errors?.amount && <p className="text-xs text-destructive">{state.errors.amount[0]}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="expDate" className="text-sm font-semibold">Date</Label>
                    <Input id="expDate" name="date" type="date" className="h-11" />
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="expNotes" className="text-sm font-semibold">
                    Notes <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea id="expNotes" name="notes" placeholder="Any additional details…" className="min-h-[60px] resize-none text-sm" />
                </div>

                {state.message && (
                  <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{state.message}</p>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>Cancel</button>
                  <button type="submit" className={cn(buttonVariants(), "flex-1 gap-2")}>
                    <CheckCircle2 className="size-4" /> Add expense
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
