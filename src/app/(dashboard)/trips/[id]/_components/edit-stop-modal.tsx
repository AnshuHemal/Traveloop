"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, MapPin, Calendar, Moon, FileText,
  Save, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { updateStop } from "../actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EditStopModalProps {
  stop: {
    id: string;
    cityName: string;
    countryName: string;
    arrivalDate: Date | null;
    departureDate: Date | null;
    nights: number;
    notes: string | null;
  };
  tripId: string;
  open: boolean;
  onClose: () => void;
}

const fmtDate = (d: Date | null) =>
  d ? format(new Date(d), "yyyy-MM-dd") : "";

export function EditStopModal({ stop, tripId, open, onClose }: EditStopModalProps) {
  const [isPending, startTransition] = useTransition();

  const [cityName,      setCityName]      = useState(stop.cityName);
  const [countryName,   setCountryName]   = useState(stop.countryName);
  const [arrivalDate,   setArrivalDate]   = useState(fmtDate(stop.arrivalDate));
  const [departureDate, setDepartureDate] = useState(fmtDate(stop.departureDate));
  const [nights,        setNights]        = useState(String(stop.nights));
  const [notes,         setNotes]         = useState(stop.notes ?? "");

  useEffect(() => {
    setCityName(stop.cityName);
    setCountryName(stop.countryName);
    setArrivalDate(fmtDate(stop.arrivalDate));
    setDepartureDate(fmtDate(stop.departureDate));
    setNights(String(stop.nights));
    setNotes(stop.notes ?? "");
  }, [stop]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cityName.trim()) return;

    startTransition(async () => {
      const result = await updateStop(stop.id, tripId, {
        cityName:      cityName.trim(),
        countryName:   countryName.trim(),
        arrivalDate:   arrivalDate   || null,
        departureDate: departureDate || null,
        nights:        parseInt(nights, 10) || 0,
        notes:         notes.trim() || null,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${cityName} updated!`);
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
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full"
          >
            {}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Edit stop</h2>
                  <p className="text-xs text-muted-foreground">{stop.cityName}</p>
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
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col gap-5">

                {}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editCity" className="text-sm font-semibold">
                      <MapPin className="size-3.5 text-primary" />
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="editCity"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      required
                      disabled={isPending}
                      className="h-11"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editCountry" className="text-sm font-semibold">
                      Country
                    </Label>
                    <Input
                      id="editCountry"
                      value={countryName}
                      onChange={(e) => setCountryName(e.target.value)}
                      disabled={isPending}
                      className="h-11"
                    />
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editArrival" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Arrival
                    </Label>
                    <Input
                      id="editArrival"
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      disabled={isPending}
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="editDeparture" className="text-sm font-semibold">
                      <Calendar className="size-3.5 text-primary" />
                      Departure
                    </Label>
                    <Input
                      id="editDeparture"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      disabled={isPending}
                      className="h-11"
                    />
                  </div>
                </div>

                {}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editNights" className="text-sm font-semibold">
                    <Moon className="size-3.5 text-primary" />
                    Nights
                  </Label>
                  <Input
                    id="editNights"
                    type="number"
                    min="0"
                    max="365"
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    disabled={isPending}
                    className="h-11"
                  />
                </div>

                {}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editNotes" className="text-sm font-semibold">
                    <FileText className="size-3.5 text-primary" />
                    Notes
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="editNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Hotel name, reminders…"
                    disabled={isPending}
                    className="min-h-[72px] resize-none text-sm"
                  />
                </div>

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
                    disabled={isPending || !cityName.trim()}
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
