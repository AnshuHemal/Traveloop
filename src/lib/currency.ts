// ─── Currency utilities ───────────────────────────────────────────────────────

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  SGD: "S$",
  CHF: "Fr",
  CNY: "¥",
  KRW: "₩",
  BRL: "R$",
  MXN: "MX$",
  THB: "฿",
  IDR: "Rp",
  AED: "د.إ",
  TRY: "₺",
  ZAR: "R",
  NZD: "NZ$",
  HKD: "HK$",
};

/**
 * Returns the symbol for a currency code, falling back to the code itself.
 * e.g. getCurrencySymbol("USD") → "$"
 *      getCurrencySymbol("XYZ") → "XYZ"
 */
export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}

/**
 * Formats an amount with the correct currency symbol.
 * e.g. formatCurrency(1234.5, "EUR") → "€1,235"
 */
export function formatCurrency(amount: number, code: string): string {
  const symbol = getCurrencySymbol(code);
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
