"use client";

import { useActionState, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Camera, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { User as AuthUser } from "@/lib/auth";
import { updateProfile, type UpdateProfileState } from "../actions";

interface ProfileTabProps {
  user: AuthUser;
}

const initialState: UpdateProfileState = {};

export function ProfileTab({ user }: ProfileTabProps) {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [name, setName] = useState(user.name ?? "");
  const [isPending, setIsPending] = useState(false);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const isDirty = name.trim() !== (user.name ?? "").trim();

  useEffect(() => {
    if (state.success) {
      toast.success("Profile updated successfully!");
    }
    if (state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <User className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground">Update your personal information.</p>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        {}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-5 rounded-2xl border border-border bg-muted/20 p-4"
        >
          <div className="relative">
            <Avatar className="size-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              title="Change avatar (coming soon)"
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name || "No name set"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Avatar upload coming soon
            </p>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              <User className="size-3.5 text-primary" />
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="h-11"
            />
            {state.errors?.name && (
              <AnimatePresence>
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {state.errors.name[0]}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          {}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">
              <Mail className="size-3.5 text-primary" />
              Email address
            </Label>
            <div className="relative">
              <Input
                value={user.email}
                disabled
                className="h-11 cursor-not-allowed opacity-60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed.
            </p>
          </div>
        </motion.div>

        {}
        <AnimatePresence>
          {state.success && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              Profile updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground">
            {isDirty ? "You have unsaved changes" : "No changes to save"}
          </p>
          <button
            type="submit"
            disabled={!isDirty || !name.trim()}
            className={cn(
              buttonVariants(),
              "gap-2 min-w-32",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <Save className="size-4" />
            Save changes
          </button>
        </motion.div>
      </form>
    </div>
  );
}
