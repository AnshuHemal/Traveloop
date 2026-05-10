"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Shield, Save, CheckCircle2,
  Lock, AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { changePassword, type ChangePasswordState } from "../actions";

const initialState: ChangePasswordState = {};

export function SecurityTab() {
  const [state, formAction] = useActionState(changePassword, initialState);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Show toast + reset form on success
  useEffect(() => {
    if (state.success) {
      toast.success("Password changed successfully!");
      formRef.current?.reset();
    }
    if (state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <div className="flex flex-col gap-5">
      {/* Change password card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Change password</h2>
            <p className="text-sm text-muted-foreground">
              Use a strong password you don&apos;t use elsewhere.
            </p>
          </div>
        </div>

        <form ref={formRef} action={formAction} className="flex flex-col gap-5">

          {/* Current password */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="currentPw" className="text-sm font-semibold">
              <Lock className="size-3.5 text-primary" />
              Current password
            </Label>
            <div className="relative">
              <Input
                id="currentPw"
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Your current password"
                required
                className={cn(
                  "h-11 pr-10",
                  state.errors?.currentPassword && "border-destructive focus-visible:ring-destructive/20",
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <AnimatePresence>
              {state.errors?.currentPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-destructive"
                >
                  <AlertCircle className="size-3 shrink-0" />
                  {state.errors.currentPassword[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* New password */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="newPw" className="text-sm font-semibold">
              <Lock className="size-3.5 text-primary" />
              New password
            </Label>
            <div className="relative">
              <Input
                id="newPw"
                name="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Min. 8 characters"
                minLength={8}
                required
                className={cn(
                  "h-11 pr-10",
                  state.errors?.newPassword && "border-destructive focus-visible:ring-destructive/20",
                )}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <AnimatePresence>
              {state.errors?.newPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-destructive"
                >
                  <AlertCircle className="size-3 shrink-0" />
                  {state.errors.newPassword[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm password */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="confirmPw" className="text-sm font-semibold">
              <Lock className="size-3.5 text-primary" />
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="confirmPw"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your new password"
                required
                className={cn(
                  "h-11 pr-10",
                  state.errors?.confirmPassword && "border-destructive focus-visible:ring-destructive/20",
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <AnimatePresence>
              {state.errors?.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-destructive"
                >
                  <AlertCircle className="size-3 shrink-0" />
                  {state.errors.confirmPassword[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Success banner */}
          <AnimatePresence>
            {state.success && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-4 shrink-0" />
                Password changed successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" className={cn(buttonVariants(), "gap-2 min-w-40")}>
              <Save className="size-4" />
              Update password
            </button>
          </div>
        </form>
      </div>

      {/* Security tips card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-muted/30 p-5"
      >
        <p className="mb-3 text-sm font-semibold text-foreground">🔒 Password tips</p>
        <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          {[
            "Use at least 8 characters",
            "Mix uppercase, lowercase, numbers, and symbols",
            "Avoid using the same password on other sites",
            "Consider using a password manager",
          ].map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
