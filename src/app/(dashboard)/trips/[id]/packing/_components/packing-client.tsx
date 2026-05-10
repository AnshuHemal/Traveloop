"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, RotateCcw, Trash2, Share2, Search,
  X, SlidersHorizontal, ChevronDown, Loader2,
  CheckCircle2, Package, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resetPackingList, clearPackingList, seedDefaultItems } from "../actions";
import { AddItemModal } from "./add-item-modal";
import { PackingItemRow } from "./packing-item-row";

const CATEGORY_CONFIG: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  DOCUMENTS:    { emoji: "📋", label: "Documents",    color: "text-sky-600",        bg: "bg-sky-500/10" },
  CLOTHING:     { emoji: "👕", label: "Clothing",     color: "text-violet-600",     bg: "bg-violet-500/10" },
  ELECTRONICS:  { emoji: "🔌", label: "Electronics",  color: "text-amber-600",      bg: "bg-amber-500/10" },
  TOILETRIES:   { emoji: "🧴", label: "Toiletries",   color: "text-emerald-600",    bg: "bg-emerald-500/10" },
  HEALTH:       { emoji: "💊", label: "Health",       color: "text-rose-600",       bg: "bg-rose-500/10" },
  MONEY:        { emoji: "💳", label: "Money",        color: "text-primary",        bg: "bg-primary/10" },
  ENTERTAINMENT:{ emoji: "🎮", label: "Entertainment",color: "text-indigo-600",     bg: "bg-indigo-500/10" },
  FOOD_SNACKS:  { emoji: "🍫", label: "Food & Snacks",color: "text-orange-600",     bg: "bg-orange-500/10" },
  OTHER:        { emoji: "📦", label: "Other",        color: "text-muted-foreground",bg: "bg-muted" },
};

interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
  essential: boolean;
  quantity: number;
  notes: string | null;
}

interface PackingClientProps {
  tripId: string;
  tripTitle: string;
  items: PackingItem[];
}

export function PackingClient({ tripId, tripTitle, items }: PackingClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterPacked, setFilterPacked] = useState<"all" | "packed" | "unpacked">("all");
  const [searchQ, setSearchQ] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter items
  const filtered = items.filter((item) => {
    if (filterCategory !== "ALL" && item.category !== filterCategory) return false;
    if (filterPacked === "packed"   && !item.packed)  return false;
    if (filterPacked === "unpacked" && item.packed)   return false;
    if (searchQ && !item.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  // Group by category
  const grouped = Object.entries(CATEGORY_CONFIG)
    .map(([cat, cfg]) => ({
      category: cat,
      ...cfg,
      items: filtered.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  // Stats
  const totalItems  = items.length;
  const packedItems = items.filter((i) => i.packed).length;
  const pct         = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  const allPacked   = totalItems > 0 && packedItems === totalItems;

  function handleReset() {
    setPendingAction("reset");
    startTransition(async () => {
      const result = await resetPackingList(tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Checklist reset — all items marked as unpacked");
      setPendingAction(null);
    });
  }

  function handleClear() {
    setPendingAction("clear");
    startTransition(async () => {
      const result = await clearPackingList(tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Checklist cleared");
      setPendingAction(null);
      setShowConfirmClear(false);
    });
  }

  function handleSeedDefaults() {
    setPendingAction("seed");
    startTransition(async () => {
      const result = await seedDefaultItems(tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Default items added!");
      setPendingAction(null);
    });
  }

  function handleShare() {
    const text = items
      .map((i) => `${i.packed ? "✅" : "⬜"} ${i.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`)
      .join("\n");
    navigator.clipboard.writeText(`Packing list for ${tripTitle}:\n\n${text}`);
    toast.success("Checklist copied to clipboard!");
  }

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* ── Progress card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "overflow-hidden rounded-2xl border p-5 transition-all",
            allPacked
              ? "border-emerald-500/30 bg-emerald-500/8"
              : "border-border bg-card",
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                allPacked ? "bg-emerald-500/15" : "bg-primary/10",
              )}>
                {allPacked ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : (
                  <Package className="size-5 text-primary" />
                )}
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {allPacked ? "All packed! 🎉" : "Packing progress"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {packedItems} of {totalItems} items packed
                </p>
              </div>
            </div>
            <span className={cn(
              "text-2xl font-bold tabular-nums",
              allPacked ? "text-emerald-500" : "text-primary",
            )}>
              {pct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn("h-full rounded-full", allPacked ? "bg-emerald-500" : "bg-primary")}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Category mini-stats */}
          {totalItems > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
                const catItems = items.filter((i) => i.category === cat);
                if (catItems.length === 0) return null;
                const catPacked = catItems.filter((i) => i.packed).length;
                return (
                  <span key={cat} className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium",
                    cfg.bg, cfg.color,
                  )}>
                    {cfg.emoji} {catPacked}/{catItems.length}
                  </span>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex flex-col gap-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search items…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className={cn(
                "h-11 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-sm outline-none transition-[color,box-shadow]",
                "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "dark:bg-input/30",
              )}
            />
            {searchQ && (
              <button onClick={() => setSearchQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />

            {/* Category filter */}
            <div className="relative">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                className={cn(
                  "h-8 appearance-none rounded-lg border border-border bg-background pl-3 pr-7 text-xs font-medium outline-none",
                  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30",
                  filterCategory !== "ALL" && "border-primary/40 bg-primary/5 text-primary",
                )}>
                <option value="ALL">All categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.emoji} {cfg.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Packed filter */}
            <div className="flex overflow-hidden rounded-lg border border-border bg-muted/30 p-0.5">
              {(["all", "unpacked", "packed"] as const).map((f) => (
                <button key={f} onClick={() => setFilterPacked(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-all",
                    filterPacked === f
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}>
                  {f}
                </button>
              ))}
            </div>

            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* ── Empty state ── */}
        {items.length === 0 ? (
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
              className="text-6xl"
            >
              🧳
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No items yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                Start with our suggested packing list or add your own items.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={handleSeedDefaults} disabled={isPending}
                className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
                {pendingAction === "seed" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Use suggested list
              </button>
              <button onClick={() => setShowAddModal(true)}
                className={cn(buttonVariants(), "gap-2")}>
                <Plus className="size-4" /> Add first item
              </button>
            </div>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border py-12 text-center"
          >
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-muted-foreground">No items match your filters</p>
          </motion.div>
        ) : (
          /* ── Grouped items ── */
          <div className="flex flex-col gap-5">
            <AnimatePresence>
              {grouped.map((group, gi) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: gi * 0.06 }}
                  className="flex flex-col gap-2"
                >
                  {/* Category header */}
                  <div className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5",
                    group.bg,
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{group.emoji}</span>
                      <span className={cn("text-sm font-bold", group.color)}>{group.label}</span>
                    </div>
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      group.bg, group.color,
                    )}>
                      {group.items.filter((i) => i.packed).length}/{group.items.length}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-1.5 pl-1">
                    <AnimatePresence>
                      {group.items.map((item, ii) => (
                        <PackingItemRow
                          key={item.id}
                          item={item}
                          tripId={tripId}
                          index={ii}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── Action bar ── */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <button onClick={() => setShowAddModal(true)}
              className={cn(buttonVariants(), "gap-2 flex-1 sm:flex-none")}>
              <Plus className="size-4" /> Add item
            </button>

            <button onClick={handleReset} disabled={isPending || packedItems === 0}
              className={cn(buttonVariants({ variant: "outline" }), "gap-2 flex-1 sm:flex-none disabled:opacity-40")}>
              {pendingAction === "reset" ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
              Reset all
            </button>

            <button onClick={handleShare}
              className={cn(buttonVariants({ variant: "outline" }), "gap-2 flex-1 sm:flex-none")}>
              <Share2 className="size-4" /> Share
            </button>

            <button onClick={() => setShowConfirmClear(true)}
              className={cn(buttonVariants({ variant: "destructive" }), "gap-2 ml-auto")}>
              <Trash2 className="size-4" /> Clear all
            </button>
          </motion.div>
        )}

        {/* ── Confirm clear dialog ── */}
        <AnimatePresence>
          {showConfirmClear && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmClear(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-x-4 top-1/3 z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
              >
                <h3 className="mb-2 text-lg font-bold text-foreground">Clear all items?</h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  This will permanently delete all {totalItems} items from your packing list. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmClear(false)}
                    className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>Cancel</button>
                  <button onClick={handleClear} disabled={isPending}
                    className={cn(buttonVariants({ variant: "destructive" }), "flex-1 gap-2")}>
                    {pendingAction === "clear" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    Clear all
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Add item modal */}
      <AddItemModal tripId={tripId} open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
