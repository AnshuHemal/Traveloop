"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { formatCurrency } from "@/lib/currency";

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

function CustomPieTooltip({
  active, payload, currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: Slice }[];
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-foreground">
        {item.payload.emoji} {item.name}
      </p>
      <p className="text-muted-foreground">
        {formatCurrency(item.value, currency)}
      </p>
    </div>
  );
}

function CustomBarTooltip({
  active, payload, label, currency,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
}

export function BudgetDonut({ slices, total, currency }: BudgetChartProps) {
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-5xl mb-3">💰</span>
        <p className="text-sm text-muted-foreground">No expenses tracked yet</p>
      </div>
    );
  }

  const data = slices
    .filter((s) => s.value > 0)
    .map((s) => ({ name: s.label, value: s.value, color: s.color, emoji: s.emoji, total }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={700}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>

        {}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-foreground leading-tight">
            {formatCurrency(total, currency)}
          </p>
          <p className="text-xs text-muted-foreground">total</p>
        </div>
      </div>

      {}
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
        {data.map((item, i) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate text-xs text-muted-foreground">{item.emoji} {item.name}</span>
              <span className="ml-auto shrink-0 text-xs font-semibold text-foreground">{pct}%</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

interface BarData {
  name: string;
  activities: number;
  expenses: number;
}

interface BudgetBarChartProps {
  data: BarData[];
  currency: string;
}

export function BudgetBarChart({ data, currency }: BudgetBarChartProps) {
  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v, currency)}
          />
          <Tooltip content={<CustomBarTooltip currency={currency} />} />
          <Bar dataKey="activities" name="Activities" fill="var(--color-primary, #0d9488)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses"   name="Expenses"   fill="var(--color-chart-2, #7c3aed)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
