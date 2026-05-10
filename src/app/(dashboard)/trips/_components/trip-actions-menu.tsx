"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreHorizontal, Eye, Pencil, Copy, Trash2,
  Globe, Lock, CheckCircle2, Clock, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteTrip, duplicateTrip, updateTripStatus, toggleTripVisibility } from "../actions";

interface TripActionsMenuProps {
  trip: {
    id: string;
    title: string;
    status: string;
    visibility: string;
  };
}

export function TripActionsMenu({ trip }: TripActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  function close() {
    setOpen(false);
    setShowDeleteConfirm(false);
  }

  async function handleDelete() {
    setPendingAction("delete");
    startTransition(async () => {
      const result = await deleteTrip(trip.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${trip.title}" deleted`);
      }
      setPendingAction(null);
      close();
    });
  }

  async function handleDuplicate() {
    setPendingAction("duplicate");
    startTransition(async () => {
      const result = await duplicateTrip(trip.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Trip duplicated!");
        router.push(`/trips/${result.id}`);
      }
      setPendingAction(null);
      close();
    });
  }

  async function handleStatusChange(status: "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED") {
    setPendingAction(`status_${status}`);
    startTransition(async () => {
      const result = await updateTripStatus(trip.id, status);
      if (result.error) toast.error(result.error);
      else toast.success(`Status updated to ${status.toLowerCase()}`);
      setPendingAction(null);
      close();
    });
  }

  async function handleVisibilityToggle() {
    const next = trip.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    setPendingAction("visibility");
    startTransition(async () => {
      const result = await toggleTripVisibility(trip.id, next);
      if (result.error) toast.error(result.error);
      else toast.success(`Trip is now ${next.toLowerCase()}`);
      setPendingAction(null);
      close();
    });
  }

  const STATUS_NEXT: Record<string, { label: string; value: "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED"; icon: React.ReactNode }[]> = {
    DRAFT:     [{ label: "Mark as Planned",   value: "PLANNED",   icon: <Clock className="size-3.5" /> }],
    PLANNED:   [{ label: "Mark as Ongoing",   value: "ONGOING",   icon: <Clock className="size-3.5" /> }],
    ONGOING:   [{ label: "Mark as Completed", value: "COMPLETED", icon: <CheckCircle2 className="size-3.5" /> }],
    COMPLETED: [{ label: "Reopen as Draft",   value: "DRAFT",     icon: <Clock className="size-3.5" /> }],
  };

  const statusActions = STATUS_NEXT[trip.status] ?? [];

  return (
    <div className="relative" onClick={(e) => e.preventDefault()}>
      {/* Trigger */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all",
          "hover:border-border hover:bg-muted hover:text-foreground",
          open && "border-border bg-muted text-foreground",
        )}
        aria-label="Trip actions"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <MoreHorizontal className="size-4" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={close} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-black/10"
            >
              {!showDeleteConfirm ? (
                <>
                  {/* Primary actions */}
                  <div className="p-1">
                    <MenuItem
                      icon={<Eye className="size-3.5" />}
                      label="View trip"
                      onClick={() => { router.push(`/trips/${trip.id}`); close(); }}
                    />
                    <MenuItem
                      icon={<Pencil className="size-3.5" />}
                      label="Edit details"
                      onClick={() => { router.push(`/trips/${trip.id}/edit`); close(); }}
                    />
                    <MenuItem
                      icon={<Copy className="size-3.5" />}
                      label="Duplicate"
                      loading={pendingAction === "duplicate"}
                      onClick={handleDuplicate}
                    />
                  </div>

                  <div className="mx-1 my-0.5 h-px bg-border" />

                  {/* Status actions */}
                  {statusActions.length > 0 && (
                    <>
                      <div className="p-1">
                        {statusActions.map((a) => (
                          <MenuItem
                            key={a.value}
                            icon={a.icon}
                            label={a.label}
                            loading={pendingAction === `status_${a.value}`}
                            onClick={() => handleStatusChange(a.value)}
                          />
                        ))}
                      </div>
                      <div className="mx-1 my-0.5 h-px bg-border" />
                    </>
                  )}

                  {/* Visibility */}
                  <div className="p-1">
                    <MenuItem
                      icon={trip.visibility === "PUBLIC"
                        ? <Lock className="size-3.5" />
                        : <Globe className="size-3.5" />}
                      label={trip.visibility === "PUBLIC" ? "Make private" : "Make public"}
                      loading={pendingAction === "visibility"}
                      onClick={handleVisibilityToggle}
                    />
                  </div>

                  <div className="mx-1 my-0.5 h-px bg-border" />

                  {/* Delete */}
                  <div className="p-1">
                    <MenuItem
                      icon={<Trash2 className="size-3.5" />}
                      label="Delete trip"
                      danger
                      onClick={() => setShowDeleteConfirm(true)}
                    />
                  </div>
                </>
              ) : (
                /* Delete confirmation */
                <div className="p-4">
                  <p className="mb-1 text-sm font-semibold text-foreground">Delete trip?</p>
                  <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                    This will permanently delete &ldquo;{trip.title}&rdquo; and all its stops and activities.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={pendingAction === "delete"}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-60"
                    >
                      {pendingAction === "delete" ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon, label, onClick, danger = false, loading = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50",
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-accent",
      )}
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : icon}
      {label}
    </button>
  );
}
