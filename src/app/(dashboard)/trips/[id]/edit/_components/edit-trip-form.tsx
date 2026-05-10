"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Calendar, Globe, Lock, DollarSign,
  FileText, Sparkles, Save, Loader2, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { CoverUpload } from "../../../new/_components/cover-upload";
import { updateTrip, type UpdateTripState } from "../../actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const CURRENCIES = [
  { code: "USD", symbol: "$",  label: "US Dollar" },
  { code: "EUR", symbol: "€",  label: "Euro" },
  { code: "GBP", symbol: "£",  label: "British Pound" },
  { code: "JPY", symbol: "¥",  label: "Japanese Yen" },
  { code: "INR", symbol: "₹",  label: "Indian Rupee" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
];

interface EditTripFormProps {
  trip: {
    id: string;
    title: string;
    description: string | null;
    startDate: Date | null;
    endDate: Date | null;
    currency: string;
    visibility: string;
    coverImage: string | null;
  };
}

const initialState: UpdateTripState = {};

export function EditTripForm({ trip }: EditTripFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateTrip, initialState);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle]           = useState(trip.title);
  const [coverImage, setCoverImage] = useState(trip.coverImage ?? "");
  const [visibility, setVisibility] = useState<"PRIVATE" | "PUBLIC">(
    trip.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
  );
  const [currency, setCurrency] = useState(trip.currency);

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      toast.success("Trip updated!");
      router.push(`/trips/${trip.id}`);
    }
  }, [state.success, router, trip.id]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("tripId",     trip.id);
    formData.set("coverImage", coverImage);
    formData.set("visibility", visibility);
    formData.set("currency",   currency);
    startTransition(() => formAction(formData));
  }

  const titleLength = title.length;
  const titleMax    = 100;

  // Format dates for input[type=date]
  const fmtDate = (d: Date | null) =>
    d ? format(new Date(d), "yyyy-MM-dd") : "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">
      <input type="hidden" name="tripId" value={trip.id} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

        {/* ── LEFT: Main fields ── */}
        <div className="flex flex-col gap-6">

          {/* Trip name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className="text-sm font-semibold">
                <MapPin className="size-3.5 text-primary" />
                Trip name
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <span className={cn(
                "text-xs tabular-nums transition-colors",
                titleLength > titleMax * 0.85 ? "text-amber-500" : "text-muted-foreground",
                titleLength >= titleMax && "text-destructive",
              )}>
                {titleLength}/{titleMax}
              </span>
            </div>
            <Input
              id="title"
              name="title"
              placeholder="e.g. European Summer Adventure"
              required
              maxLength={titleMax}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="h-11 text-base"
              autoFocus
            />
            {state.errors?.title && <ErrorMsg messages={state.errors.title} />}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="description" className="text-sm font-semibold">
              <FileText className="size-3.5 text-primary" />
              Description
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What's this trip about?"
              maxLength={500}
              defaultValue={trip.description ?? ""}
              disabled={isPending}
              className="min-h-[100px] resize-none text-sm"
            />
          </motion.div>

          {/* Date range */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate" className="text-sm font-semibold">
                <Calendar className="size-3.5 text-primary" />
                Start date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={fmtDate(trip.startDate)}
                disabled={isPending}
                className="h-11"
              />
              {state.errors?.startDate && <ErrorMsg messages={state.errors.startDate} />}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate" className="text-sm font-semibold">
                <Calendar className="size-3.5 text-primary" />
                End date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={fmtDate(trip.endDate)}
                disabled={isPending}
                className="h-11"
              />
              {state.errors?.endDate && <ErrorMsg messages={state.errors.endDate} />}
            </div>
          </motion.div>

          {/* Currency + Visibility */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Currency */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">
                <DollarSign className="size-3.5 text-primary" />
                Currency
              </Label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={isPending}
                  className={cn(
                    "h-11 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-sm shadow-xs outline-none transition-[color,box-shadow]",
                    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                  )}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code} — {c.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">
                <Globe className="size-3.5 text-primary" />
                Visibility
              </Label>
              <div className="flex h-11 overflow-hidden rounded-md border border-input">
                {(["PRIVATE", "PUBLIC"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    disabled={isPending}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 text-xs font-medium transition-all",
                      visibility === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {v === "PRIVATE" ? (
                      <><Lock className="size-3" /> Private</>
                    ) : (
                      <><Globe className="size-3" /> Public</>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Global error */}
          <AnimatePresence>
            {state.message && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
              >
                {state.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="flex gap-3"
          >
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1 h-12")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex-1 gap-2 h-12 text-base font-semibold",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {isPending ? (
                <><Loader2 className="size-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="size-4" /> Save changes</>
              )}
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: Cover photo ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Cover photo</p>
                <p className="text-xs text-muted-foreground">Optional — makes your trip stand out</p>
              </div>
            </div>
            <CoverUpload value={coverImage} onChange={setCoverImage} />
          </div>

          {/* Live preview */}
          <AnimatePresence>
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-lg shadow-primary/5"
              >
                <div className="border-b border-border bg-muted/30 px-4 py-2.5">
                  <p className="text-xs font-medium text-muted-foreground">Preview</p>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl">
                      ✈️
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground line-clamp-1">{title}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3 text-primary" />
                          {currency}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          visibility === "PUBLIC"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}>
                          {visibility === "PUBLIC" ? <Globe className="size-2.5" /> : <Lock className="size-2.5" />}
                          {visibility === "PUBLIC" ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </form>
  );
}

function ErrorMsg({ messages }: { messages: string[] }) {
  return (
    <AnimatePresence>
      {messages.map((msg) => (
        <motion.p
          key={msg}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-destructive"
        >
          {msg}
        </motion.p>
      ))}
    </AnimatePresence>
  );
}
