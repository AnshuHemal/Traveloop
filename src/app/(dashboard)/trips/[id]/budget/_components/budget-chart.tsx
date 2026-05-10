"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Slice {
  label: string;
  value: number;
  color: string;
  emoji: string;
}

interface BudgetChartProps {
  slices: Slice[];
  total: number;
  currency: string;
}

// Simple animated donut chart using SVG
export function BudgetDonut({ slices, total, currency }: BudgetChartProps) {
  const SIZE = 200;
  const STROKE = 32;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  let offset = 0;
  const segments = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const pct = total > 0 ? s.value / total : 0;
      const dash = pct * CIRC;
      const gap = CIRC - dash;
      const seg = { ...s, pct, dash, gap, offset };
      offset += dash;
      return seg;
    });

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-5xl mb-3">💰</span>
        <p className="text-sm text-muted-foreground">No expenses tracked yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* SVG donut */}
      <div className="relative">
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-muted/40"
          />
          {/* Segments */}
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.label}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${CIRC}` }}
              animate={{ strokeDasharray: `${seg.dash} ${seg.gap}` }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-foreground"
          >
            {currency} {total.toLocaleString()}
          </motion.p>
          <p className="text-xs text-muted-foreground">total budget</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid w-full grid-cols-2 gap-2">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="flex items-center gap-2"
          >
            <span className="text-base">{seg.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-xs font-medium text-foreground">{seg.label}</span>
                <span className="shrink-0 text-xs font-bold text-foreground">
                  {Math.round(seg.pct * 100)}%
                </span>
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: seg.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${seg.pct * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.06, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
