"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Package, Tag, Hash, FileText,
  CheckCircle2, Loader2, Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addPackingItem, type AddItemState } from "../actions";

const CATEGORIES = [
  { value: "DOCUMENTS",    label: "Documents",    emoji: "📋" },
  { value: "CLOTHING",     label: "Clothing",     emoji: "👕" },
  { value: "ELECTRONICS",  label: "Electronics",  emoji: "🔌" },
  { value: "TOILETRIES",   label: "Toiletries",   emoji: "🧴" },
  { value: "HEALTH",       label: "Health",       emoji: "💊" },
  { value: "MONEY",        label: "Money",        emoji: "💳" },
  { value: "ENTERTAINMENT",label: "Entertainment",emoji: "🎮" },
  { value: "FOOD_SNACKS",  label: "Food & Snacks",emoji: "🍫" },
  { value: "OTHER",        label: "Other",        emoji: "📦" },
];

interface AddItemModalProps {
  tripId: string;
  open: boolean;
  onClose: () => void;
}

const initialState: AddItemState = {};

export function AddItemModal({ tripId, open, onClose }: AddItemModalProps) {
  const [state, formAction] = useActionState(addPackingItem, initialState);
  const [category, setCategory] = useState("OTHER");
  const [essential, setEssential] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) { formRef.current?.reset(); setCategory("OTHER"); setEssential(false); onClose(); }
  }, [state.success, onClose]);

  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 100);
  }, [open]);

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
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="size-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">Add packing item</h2>
              </div>
              <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <form ref={formRef} action={formAction} className="p-6">
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="essential" value={String(essential)} />

              <div className="flex flex-col gap-5">
                {/* Item name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="itemName" className="text-sm font-semibold">
                    <Package className="size-3.5 text-primary" />
                    Item name <span className="text-destructive">*</span>
                  </Label>
                  <Input ref={nameRef} id="itemName" name="name" placeholder="e.g. Passport, Phone charger…" required className="h-11" />
                  {state.errors?.name && <p className="text-xs text-destructive">{state.errors.name[0]}</p>}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">
                    <Tag className="size-3.5 text-primary" />
                    Category
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all",
                          category === cat.value
                            ? "border-primary bg-primary/8 text-primary"
                            : "border-transparent bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground",
                        )}>
                        <span className="text-base">{cat.emoji}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity + Essential row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="quantity" className="text-sm font-semibold">
                      <Hash className="size-3.5 text-primary" />
                      Quantity
                    </Label>
                    <Input id="quantity" name="quantity" type="number" min="1" max="99" defaultValue="1" className="h-11" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                      <Star className="size-3.5 text-primary" />
                      Essential
                    </Label>
                    <button type="button" onClick={() => setEssential((v) => !v)}
                      className={cn(
                        "flex h-11 items-center gap-2 rounded-xl border-2 px-3 text-sm font-medium transition-all",
                        essential
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30",
                      )}>
                      <Star className={cn("size-4", essential && "fill-amber-500 text-amber-500")} />
                      {essential ? "Essential" : "Optional"}
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="itemNotes" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Notes <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea id="itemNotes" name="notes" placeholder="Size, brand, reminder…" className="min-h-[60px] resize-none text-sm" />
                </div>

                {state.message && (
                  <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{state.message}</p>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>Cancel</button>
                  <button type="submit" className={cn(buttonVariants(), "flex-1 gap-2")}>
                    <CheckCircle2 className="size-4" /> Add item
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
