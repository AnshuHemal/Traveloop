"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2, Copy, Check, Link2, Globe, Lock,
  Trash2, Loader2, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { generateShareLink, revokeShareLink } from "../actions";

interface ShareClientProps {
  tripId: string;
  tripTitle: string;
  shareToken: string | null;
  appUrl: string;
}

export function ShareClient({ tripId, tripTitle, shareToken: initialToken, appUrl }: ShareClientProps) {
  const [token, setToken] = useState(initialToken);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"generate" | "revoke" | null>(null);

  const shareUrl = token ? `${appUrl}/t/${token}` : null;

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGenerate() {
    setPendingAction("generate");
    startTransition(async () => {
      const result = await generateShareLink(tripId);
      if (result.error) toast.error(result.error);
      else if (result.token) {
        setToken(result.token);
        toast.success("Share link generated!");
      }
      setPendingAction(null);
    });
  }

  function handleRevoke() {
    setPendingAction("revoke");
    startTransition(async () => {
      const result = await revokeShareLink(tripId);
      if (result.error) toast.error(result.error);
      else {
        setToken(null);
        toast.success("Share link revoked");
      }
      setPendingAction(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "overflow-hidden rounded-2xl border p-6",
          token
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-border bg-card",
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            token ? "bg-emerald-500/10" : "bg-muted",
          )}>
            {token ? (
              <Globe className="size-6 text-emerald-500" />
            ) : (
              <Lock className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">
              {token ? "Trip is publicly shared" : "Trip is private"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {token
                ? "Anyone with the link can view your full itinerary."
                : "Only you can see this trip. Generate a link to share it."}
            </p>
          </div>
        </div>

        {/* Share URL */}
        <AnimatePresence>
          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-5"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
                <Link2 className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm font-mono text-foreground">{shareUrl}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                      copied
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
                    )}
                  >
                    {copied ? <><Check className="size-3.5" /> Copied!</> : <><Copy className="size-3.5" /> Copy</>}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        {!token ? (
          <button
            onClick={handleGenerate}
            disabled={isPending}
            className={cn(buttonVariants({ size: "lg" }), "gap-2 w-full")}
          >
            {pendingAction === "generate" ? (
              <><Loader2 className="size-4 animate-spin" /> Generating…</>
            ) : (
              <><Share2 className="size-4" /> Generate share link</>
            )}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={cn(buttonVariants(), "flex-1 gap-2")}
            >
              {copied ? <><Check className="size-4" /> Copied!</> : <><Copy className="size-4" /> Copy link</>}
            </button>
            <button
              onClick={handleRevoke}
              disabled={isPending}
              className={cn(buttonVariants({ variant: "destructive" }), "gap-2")}
            >
              {pendingAction === "revoke" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Revoke
            </button>
          </div>
        )}
      </motion.div>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {[
          { emoji: "👁️", title: "Read-only", desc: "Viewers can see your itinerary but cannot edit it." },
          { emoji: "🔗", title: "Link-based", desc: "Only people with the link can access your trip." },
          { emoji: "🔒", title: "Revocable", desc: "You can revoke the link at any time to make it private again." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 text-2xl">{item.emoji}</div>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
