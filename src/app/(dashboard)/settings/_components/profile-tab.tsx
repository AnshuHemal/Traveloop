"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { User as AuthUser } from "@/lib/auth";

interface ProfileTabProps {
  user: AuthUser;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [name, setName] = useState(user.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save — in production wire to a server action
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Profile updated!");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-1 text-lg font-bold text-foreground">Profile</h2>
      <p className="mb-6 text-sm text-muted-foreground">Update your personal information.</p>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              <User className="size-3.5 text-primary" /> Full name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">
              <Mail className="size-3.5 text-primary" /> Email address
            </Label>
            <Input
              value={user.email}
              disabled
              className="h-11 opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={cn(buttonVariants(), "gap-2")}
          >
            {isSaving ? (
              <><Loader2 className="size-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="size-4" /> Save changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
