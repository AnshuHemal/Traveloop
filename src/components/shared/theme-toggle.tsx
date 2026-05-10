"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

const MODES: { value: Mode; icon: typeof Sun; label: string }[] = [
  { value: "light",  icon: Sun,     label: "Light" },
  { value: "dark",   icon: Moon,    label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

interface ThemeToggleProps {
  variant?: "icon" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-border bg-background",
        className,
      )}>
        <div className="size-4 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";
  const CurrentIcon = isDark ? Moon : theme === "system" ? Monitor : Sun;

  if (variant === "icon") {
    return (
      <div className="relative" data-theme-toggle>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle theme"
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-all",
            "hover:bg-accent hover:text-foreground",
            open && "bg-accent text-foreground",
            className,
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={resolvedTheme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <CurrentIcon className="size-4" />
            </motion.span>
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl shadow-black/10 min-w-[130px]"
              >
                {MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => { setTheme(mode.value); setOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      theme === mode.value
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    <mode.icon className="size-4 shrink-0" />
                    {mode.label}
                    {theme === mode.value && (
                      <motion.span
                        layoutId="theme-check"
                        className="ml-auto size-1.5 rounded-full bg-primary"
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn("flex overflow-hidden rounded-xl border border-border bg-muted/30 p-0.5", className)}>
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setTheme(mode.value)}
          title={mode.label}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg transition-all",
            theme === mode.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <mode.icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
