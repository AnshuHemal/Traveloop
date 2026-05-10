"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COVERS = [
  { id: "paris",     emoji: "🗼", label: "Paris",     gradient: "from-rose-400 via-pink-500 to-rose-600" },
  { id: "tokyo",     emoji: "🗾", label: "Tokyo",     gradient: "from-violet-400 via-purple-500 to-violet-600" },
  { id: "bali",      emoji: "🌴", label: "Bali",      gradient: "from-emerald-400 via-teal-500 to-emerald-600" },
  { id: "newyork",   emoji: "🗽", label: "New York",  gradient: "from-sky-400 via-blue-500 to-sky-600" },
  { id: "santorini", emoji: "🏝️", label: "Santorini", gradient: "from-cyan-400 via-sky-500 to-cyan-600" },
  { id: "rome",      emoji: "🏛️", label: "Rome",      gradient: "from-amber-400 via-orange-500 to-amber-600" },
  { id: "adventure", emoji: "🏔️", label: "Adventure", gradient: "from-slate-400 via-gray-500 to-slate-600" },
  { id: "beach",     emoji: "🏖️", label: "Beach",     gradient: "from-yellow-400 via-amber-500 to-yellow-600" },
];

interface CoverUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tab, setTab] = useState<"presets" | "upload">("presets");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const selectedPreset = PRESET_COVERS.find((p) => p.id === value);
  const isCustomImage = value.startsWith("data:");

  return (
    <div className="flex flex-col gap-3">
      {}
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-xl"
          >
            {isCustomImage ? (

              <img
                src={value}
                alt="Cover"
                className="h-36 w-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-36 w-full items-center justify-center bg-linear-to-br text-5xl",
                  selectedPreset?.gradient ?? "from-primary/20 to-primary/5",
                )}
              >
                {selectedPreset?.emoji ?? "✈️"}
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <X className="size-3.5" />
            </button>
            <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {isCustomImage ? "Custom photo" : selectedPreset?.label}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30"
          >
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
              <p className="text-xs">No cover selected</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
        {(["presets", "upload"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "presets" ? "Choose preset" : "Upload photo"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "presets" ? (
          <motion.div
            key="presets"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-4 gap-2"
          >
            {PRESET_COVERS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(preset.id)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border-2 transition-all duration-200",
                  value === preset.id
                    ? "border-primary shadow-md shadow-primary/20"
                    : "border-transparent hover:border-border",
                )}
              >
                <div
                  className={cn(
                    "flex h-14 items-center justify-center bg-linear-to-br text-2xl",
                    preset.gradient,
                  )}
                >
                  {preset.emoji}
                </div>
                <p className="py-1 text-center text-[10px] font-medium text-muted-foreground">
                  {preset.label}
                </p>
                {value === preset.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary"
                  >
                    <Check className="size-2.5 text-primary-foreground" />
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
              )}
            >
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex size-10 items-center justify-center rounded-xl bg-primary/10"
              >
                <Upload className="size-5 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? "Drop it here!" : "Drop a photo or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
