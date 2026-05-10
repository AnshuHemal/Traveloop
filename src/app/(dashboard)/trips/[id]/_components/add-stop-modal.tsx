"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, MapPin, Calendar, Moon, FileText,
  Loader2, CheckCircle2, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { addStop, type AddStopState } from "../actions";
import { cn } from "@/lib/utils";

const POPULAR_CITIES = [
  { city: "Paris",      country: "France",    code: "FR", emoji: "🗼" },
  { city: "Tokyo",      country: "Japan",     code: "JP", emoji: "🗾" },
  { city: "New York",   country: "USA",       code: "US", emoji: "🗽" },
  { city: "Rome",       country: "Italy",     code: "IT", emoji: "🏛️" },
  { city: "Barcelona",  country: "Spain",     code: "ES", emoji: "🎨" },
  { city: "Bali",       country: "Indonesia", code: "ID", emoji: "🌴" },
  { city: "London",     country: "UK",        code: "GB", emoji: "🎡" },
  { city: "Dubai",      country: "UAE",       code: "AE", emoji: "🏙️" },
  { city: "Bangkok",    country: "Thailand",  code: "TH", emoji: "🏯" },
  { city: "Santorini",  country: "Greece",    code: "GR", emoji: "🏝️" },
  { city: "Sydney",     country: "Australia", code: "AU", emoji: "🦘" },
  { city: "Amsterdam",  country: "Netherlands", code: "NL", emoji: "🌷" },
  { city: "Lisbon",     country: "Portugal",  code: "PT", emoji: "🌊" },
  { city: "Istanbul",   country: "Turkey",    code: "TR", emoji: "🕌" },
  { city: "Singapore",  country: "Singapore", code: "SG", emoji: "🦁" },
  { city: "Prague",     country: "Czech Republic", code: "CZ", emoji: "🏰" },
];

interface AddStopModalProps {
  tripId: string;
  open: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

const initialState: AddStopState = {};

export function AddStopModal({ tripId, open, onClose, defaultDestination }: AddStopModalProps) {
  const [state, formAction] = useActionState(addStop, initialState);
  const [cityQuery, setCityQuery] = useState(defaultDestination ?? "");
  const [selectedCity, setSelectedCity] = useState<typeof POPULAR_CITIES[0] | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const filtered = cityQuery.length > 0
    ? POPULAR_CITIES.filter(
        (c) =>
          c.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(cityQuery.toLowerCase()),
      )
    : POPULAR_CITIES.slice(0, 8);

  // Close on success
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setCityQuery("");
      setSelectedCity(null);
      onClose();
    }
  }, [state.success, onClose]);

  // Focus city input when modal opens
  useEffect(() => {
    if (open) setTimeout(() => cityInputRef.current?.focus(), 100);
  }, [open]);

  function handleCitySelect(c: typeof POPULAR_CITIES[0]) {
    setSelectedCity(c);
    setCityQuery(c.city);
    setShowSuggestions(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">Add a stop</h2>
              </div>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} action={formAction} className="p-6">
              <input type="hidden" name="tripId" value={tripId} />
              {selectedCity && (
                <>
                  <input type="hidden" name="countryName" value={selectedCity.country} />
                  <input type="hidden" name="countryCode" value={selectedCity.code} />
                </>
              )}

              <div className="flex flex-col gap-5">
                {/* City search */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">
                    <MapPin className="size-3.5 text-primary" />
                    City / Destination
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <div className="relative" data-city-search>
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={cityInputRef}
                      name="cityName"
                      type="text"
                      placeholder="Search cities…"
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        setSelectedCity(null);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      required
                      className={cn(
                        "h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none transition-[color,box-shadow]",
                        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                        "dark:bg-input/30",
                        selectedCity && "border-primary/50 bg-primary/5",
                      )}
                    />
                    {selectedCity && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                        {selectedCity.emoji}
                      </span>
                    )}

                    {/* Suggestions dropdown */}
                    <AnimatePresence>
                      {showSuggestions && filtered.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full z-10 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl"
                        >
                          <div className="p-1.5">
                            {filtered.map((c) => (
                              <button
                                key={`${c.city}-${c.code}`}
                                type="button"
                                onMouseDown={() => handleCitySelect(c)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                <span className="text-xl">{c.emoji}</span>
                                <div className="text-left">
                                  <p className="font-medium text-foreground">{c.city}</p>
                                  <p className="text-xs text-muted-foreground">{c.country}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {state.errors?.cityName && (
                    <p className="text-xs text-destructive">{state.errors.cityName[0]}</p>
                  )}
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="arrivalDate" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Arrival
                    </Label>
                    <Input id="arrivalDate" name="arrivalDate" type="date" className="h-11" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="departureDate" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Departure
                    </Label>
                    <Input id="departureDate" name="departureDate" type="date" className="h-11" />
                  </div>
                </div>

                {/* Nights */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nights" className="text-sm font-semibold">
                    <Moon className="size-3.5 text-primary" />
                    Nights
                  </Label>
                  <Input
                    id="nights"
                    name="nights"
                    type="number"
                    min="0"
                    max="365"
                    defaultValue="1"
                    className="h-11"
                  />
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Notes
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Hotel name, things to do, reminders…"
                    className="min-h-[72px] resize-none text-sm"
                  />
                </div>

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
                  <AddStopSubmitButton />
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AddStopSubmitButton() {
  return (
    <button
      type="submit"
      className={cn(buttonVariants(), "flex-1 gap-2")}
    >
      <CheckCircle2 className="size-4" />
      Add stop
    </button>
  );
}
