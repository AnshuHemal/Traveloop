"use client";

import { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, FileText, CheckCircle2, Clock,
  Printer, Share2, ChevronDown, Loader2,
  TrendingUp, AlertTriangle, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { markInvoicePaid } from "../actions";

const CATEGORY_EMOJI: Record<string, string> = {
  ACCOMMODATION: "🏨",
  FOOD:          "🍜",
  TRANSPORT:     "✈️",
  ACTIVITIES:    "🎭",
  SHOPPING:      "🛍️",
  VISA:          "📋",
  INSURANCE:     "🛡️",
  MISC:          "📌",
};

interface LineItem {
  id: string;
  category: string;
  label: string;
  qty: string;
  unitCost: number;
  amount: number;
  stopName: string | null;
  date: Date | null;
  isActivity: boolean;
}

interface InvoiceData {
  tripId: string;
  invoiceId: string;
  tripTitle: string;
  tripDescription: string | null;
  startDate: Date | null;
  endDate: Date | null;
  currency: string;
  status: string;
  ownerName: string;
  stopCount: number;
  lineItems: LineItem[];
  activityTotal: number;
  expenseTotal: number;
  grandTotal: number;
  taxRate: number;
  discountAmount: number;
  stops: { cityName: string }[];
}

interface InvoiceClientProps {
  data: InvoiceData;
}

const STATUS_CONFIG = {
  DRAFT:     { label: "Draft",     color: "bg-muted text-muted-foreground",                           icon: Clock },
  PLANNED:   { label: "Pending",   color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",       icon: Clock },
  ONGOING:   { label: "Active",    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  COMPLETED: { label: "Paid",      color: "bg-primary/10 text-primary",                               icon: CheckCircle2 },
} as const;

export function InvoiceClient({ data }: InvoiceClientProps) {
  const [taxRate, setTaxRate]         = useState(data.taxRate);
  const [discount, setDiscount]       = useState(data.discountAmount);
  const [isPending, startTransition]  = useTransition();
  const [showTaxEdit, setShowTaxEdit] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const subtotal   = data.grandTotal;
  const taxAmount  = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const finalTotal = subtotal + taxAmount - discount;

  const statusCfg = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const StatusIcon = statusCfg.icon;

  const isOverBudget = finalTotal > subtotal * 1.1;

  function handlePrint() {
    window.print();
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Invoice link copied!");
  }

  function handleMarkPaid() {
    startTransition(async () => {
      const result = await markInvoicePaid(data.tripId);
      if (result.error) toast.error(result.error);
      else toast.success("Trip marked as completed / paid!");
    });
  }

  const dateRange = data.startDate && data.endDate
    ? `${format(new Date(data.startDate), "MMM d")} – ${format(new Date(data.endDate), "MMM d, yyyy")}`
    : data.startDate
      ? `From ${format(new Date(data.startDate), "MMM d, yyyy")}`
      : null;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Action bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
            statusCfg.color,
          )}>
            <StatusIcon className="size-3.5" />
            {statusCfg.label}
          </span>
          <span className="text-sm text-muted-foreground font-mono">{data.invoiceId}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Printer className="size-4" /> Print
          </button>
          <button onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Share2 className="size-4" /> Share
          </button>
          {data.status !== "COMPLETED" && (
            <button onClick={handleMarkPaid} disabled={isPending}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-60">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Mark as paid
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Invoice document ── */}
      <motion.div
        ref={invoiceRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm print:shadow-none print:border-0"
      >
        {/* Invoice header */}
        <div className="bg-linear-to-br from-primary/15 via-primary/8 to-transparent px-8 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: trip info */}
            <div className="flex items-start gap-5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm shadow-sm text-3xl">
                ✈️
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{data.tripTitle}</h2>
                {data.tripDescription && (
                  <p className="mt-0.5 text-sm text-muted-foreground max-w-xs line-clamp-2">{data.tripDescription}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {dateRange && <span>📅 {dateRange}</span>}
                  <span>📍 {data.stopCount} {data.stopCount === 1 ? "city" : "cities"}</span>
                  <span>👤 {data.ownerName}</span>
                </div>
                {data.stops.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {data.stops.map((s) => (
                      <span key={s.cityName} className="rounded-full bg-background/70 px-2.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
                        {s.cityName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: invoice meta */}
            <div className="flex flex-col gap-2 text-sm sm:text-right">
              <div>
                <p className="text-xs text-muted-foreground">Invoice ID</p>
                <p className="font-mono font-semibold text-foreground">{data.invoiceId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Generated</p>
                <p className="font-medium text-foreground">{format(new Date(), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="font-semibold text-foreground">{data.currency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stop</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Qty/Details</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unit Cost</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.lineItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">🧾</span>
                        <p className="text-sm">No expenses or activities yet</p>
                        <Link href={`/trips/${data.tripId}/budget`}
                          className="text-xs text-primary hover:underline">
                          Add expenses in Budget →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.lineItems.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        "border-b border-border/50 transition-colors hover:bg-muted/20",
                        item.isActivity && "bg-primary/3",
                      )}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="text-base">{CATEGORY_EMOJI[item.category] ?? "📌"}</span>
                          <span className="text-xs font-medium text-muted-foreground capitalize">
                            {item.category.toLowerCase().replace("_", " ")}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{item.label}</p>
                        {item.date && (
                          <p className="text-[10px] text-muted-foreground">
                            {format(new Date(item.date), "MMM d, yyyy")}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {item.stopName ?? <span className="italic opacity-50">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">{item.qty}</td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                        {formatCurrency(item.unitCost, data.currency)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                        {formatCurrency(item.amount, data.currency)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Totals section */}
        <div className="border-t border-border px-8 py-6">
          <div className="flex flex-col items-end gap-0">
            <div className="w-full max-w-xs flex flex-col gap-2">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono font-medium text-foreground">{formatCurrency(subtotal, data.currency)}</span>
              </div>

              {/* Activity vs Expense breakdown */}
              {data.activityTotal > 0 && data.expenseTotal > 0 && (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pl-3">
                    <span>🎭 Activities</span>
                    <span className="font-mono">{formatCurrency(data.activityTotal, data.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pl-3">
                    <span>🧾 Expenses</span>
                    <span className="font-mono">{formatCurrency(data.expenseTotal, data.currency)}</span>
                  </div>
                </>
              )}

              {/* Tax */}
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setShowTaxEdit((v) => !v)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tax ({taxRate}%)
                  <ChevronDown className={cn("size-3 transition-transform", showTaxEdit && "rotate-180")} />
                </button>
                <span className="font-mono font-medium text-foreground">{formatCurrency(taxAmount, data.currency)}</span>
              </div>

              <AnimatePresence>
                {showTaxEdit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                      <span className="text-xs text-muted-foreground">Tax rate:</span>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-16 rounded-md border border-input bg-background px-2 py-1 text-xs text-center outline-none focus-visible:border-ring"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Discount */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">−</span>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-24 rounded-md border border-input bg-background px-2 py-1 text-right text-xs font-mono outline-none focus-visible:border-ring"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="my-1 h-px bg-border" />

              {/* Grand total */}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Grand Total</span>
                <motion.span
                  key={finalTotal}
                  initial={{ scale: 0.95, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "font-mono text-xl font-bold",
                    isOverBudget ? "text-destructive" : "text-primary",
                  )}
                >
                  {formatCurrency(finalTotal, data.currency)}
                </motion.span>
              </div>

              {isOverBudget && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  <AlertTriangle className="size-3.5 shrink-0" />
                  Budget exceeded — consider reviewing expenses
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice footer */}
        <div className="border-t border-border bg-muted/20 px-8 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Generated by Traveloop · {format(new Date(), "MMMM d, yyyy")}
            </p>
            <p className="text-xs text-muted-foreground font-mono">{data.invoiceId}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Budget insights sidebar card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="size-4 text-primary" />
          </div>
          <h3 className="font-bold text-foreground">Budget Insights</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Subtotal",  value: formatCurrency(subtotal,   data.currency), color: "text-foreground" },
            { label: "Tax",       value: formatCurrency(taxAmount,  data.currency), color: "text-amber-600 dark:text-amber-400" },
            { label: "Grand Total", value: formatCurrency(finalTotal, data.currency), color: isOverBudget ? "text-destructive" : "text-primary" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex flex-col gap-1 rounded-xl bg-muted/30 p-3 text-center"
            >
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className={cn("text-base font-bold font-mono", item.color)}>{item.value}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <Link
            href={`/trips/${data.tripId}/budget`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <DollarSign className="size-4" />
            View full budget
          </Link>
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="size-4" />
            Download invoice
          </button>
        </div>
      </motion.div>

    </div>
  );
}
