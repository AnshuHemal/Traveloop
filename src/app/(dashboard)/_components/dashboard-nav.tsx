"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Bell, ChevronDown, LogOut, Settings, User, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { User as AuthUser } from "@/lib/auth";

interface DashboardNavProps {
  user: AuthUser;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {}
        <Logo size={26} />

        {}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/dashboard" className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/trips" className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            My Trips
          </Link>
          <Link href="/explore" className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="/activities" className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            Activities
          </Link>
        </nav>

        {}
        <div className="flex items-center gap-2">
          {}
          <Link
            href="/trips/new"
            className={cn(buttonVariants({ size: "sm" }), "hidden gap-1.5 sm:inline-flex")}
          >
            <Plus className="size-4" />
            New trip
          </Link>

          {}
          <button className="hidden size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors sm:flex">
            <Bell className="size-4" />
          </button>

          <ThemeToggle />

          {}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              <Avatar className="size-7">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden font-medium text-foreground sm:block max-w-24 truncate">
                {user.name?.split(" ")[0] ?? "Account"}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-20 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-black/10"
                  >
                    {}
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {}
                    <div className="p-1">
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <Settings className="size-4 text-muted-foreground" />
                        Settings
                      </Link>
                      <Link
                        href="/settings/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <User className="size-4 text-muted-foreground" />
                        Profile
                      </Link>
                    </div>

                    <div className="border-t border-border p-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {}
          <button
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/trips" onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                My Trips
              </Link>
              <Link href="/explore" onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Explore
              </Link>
              <Link href="/activities" onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Activities
              </Link>
              <div className="mt-2 border-t border-border pt-2">
                <Link
                  href="/trips/new"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants(), "w-full justify-center gap-2")}
                >
                  <Plus className="size-4" /> New trip
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
