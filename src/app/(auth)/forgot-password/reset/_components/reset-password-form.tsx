"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOtp } from "@/lib/auth-client";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const otp   = searchParams.get("otp")   ?? "";

  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [isPending, setIsPending]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);

    const { error: authError } = await emailOtp.resetPassword({
      email,
      otp,
      password,
    });

    if (authError) {
      setError(authError.message ?? "Failed to reset password. Please try again.");
      setIsPending(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => { window.location.href = "/login"; }, 2000);
  }

  if (success) {
    return (
      <FadeIn className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-8 py-12 shadow-xl shadow-black/5 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-4 flex justify-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">Password reset!</h2>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting you to sign in…</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-8 py-9 shadow-xl shadow-black/5">
        <FadeIn direction="down" delay={0.05} className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Choose a strong password for your account
          </p>
        </FadeIn>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isPending}
                className="h-11 pr-10"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm" className="text-sm font-medium">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={isPending}
              className="h-11"
            />
          </div>

          {error && (
            <div className={cn("rounded-lg border px-3.5 py-2.5 text-sm bg-destructive/8 border-destructive/20 text-destructive")}>
              {error}
            </div>
          )}

          <Button type="submit" className="h-11 w-full font-semibold" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="inline-block">
                  <RotateCcw className="size-4" />
                </motion.span>
                Resetting…
              </span>
            ) : "Reset password"}
          </Button>
        </form>
      </div>
    </FadeIn>
  );
}
