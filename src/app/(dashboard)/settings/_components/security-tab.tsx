"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Password updated!");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Security</h2>
          <p className="text-sm text-muted-foreground">Manage your password and account security.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPw" className="text-sm font-semibold">Current password</Label>
          <div className="relative">
            <Input
              id="currentPw"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              placeholder="••••••••"
              required
              className="h-11 pr-10"
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="newPw" className="text-sm font-semibold">New password</Label>
          <div className="relative">
            <Input
              id="newPw"
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 characters"
              minLength={8}
              required
              className="h-11 pr-10"
            />
            <button type="button" onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPw" className="text-sm font-semibold">Confirm new password</Label>
          <Input id="confirmPw" name="confirmPassword" type="password" placeholder="Repeat new password" required className="h-11" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className={cn(buttonVariants(), "gap-2")}>
            {isSaving ? <><Loader2 className="size-4 animate-spin" /> Updating…</> : <><Save className="size-4" /> Update password</>}
          </button>
        </div>
      </form>
    </div>
  );
}
