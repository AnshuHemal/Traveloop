"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Shield, Bell, Palette, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { User as AuthUser } from "@/lib/auth";
import { ProfileTab } from "./profile-tab";
import { SecurityTab } from "./security-tab";

const TABS = [
  { id: "profile",  label: "Profile",   icon: User },
  { id: "security", label: "Security",  icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance",   label: "Appearance",    icon: Palette },
] as const;

type TabId = typeof TABS[number]["id"];

interface SettingsClientProps {
  user: AuthUser;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all text-left",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <tab.icon className="size-4 shrink-0" />
            {tab.label}
          </button>
        ))}
        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "profile"  && <ProfileTab user={user} />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "appearance"    && <AppearanceTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    tripUpdates: true,
    budgetAlerts: true,
    weeklyDigest: false,
    marketing: false,
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-1 text-lg font-bold text-foreground">Notifications</h2>
      <p className="mb-6 text-sm text-muted-foreground">Choose what you want to be notified about.</p>
      <div className="flex flex-col gap-4">
        {[
          { key: "tripUpdates",  label: "Trip updates",    desc: "When your trips are modified or shared" },
          { key: "budgetAlerts", label: "Budget alerts",   desc: "When you're approaching your budget limit" },
          { key: "weeklyDigest", label: "Weekly digest",   desc: "A summary of your upcoming trips" },
          { key: "marketing",    label: "Tips & features", desc: "Product updates and travel inspiration" },
        ].map((item) => (
          <label key={item.key} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div
              onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                prefs[item.key as keyof typeof prefs] ? "bg-primary" : "bg-muted",
              )}
            >
              <motion.div
                animate={{ x: prefs[item.key as keyof typeof prefs] ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 size-4 rounded-full bg-white shadow"
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState("system");
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-1 text-lg font-bold text-foreground">Appearance</h2>
      <p className="mb-6 text-sm text-muted-foreground">Customize how Traveloop looks for you.</p>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light",  label: "Light",  emoji: "☀️" },
            { value: "dark",   label: "Dark",   emoji: "🌙" },
            { value: "system", label: "System", emoji: "💻" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                theme === t.value
                  ? "border-primary bg-primary/8"
                  : "border-border hover:border-primary/30",
              )}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-xs font-medium text-foreground">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
