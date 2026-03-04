// Display formatting utilities used across the frontend.

export function formatPrice(value: number | null | undefined, currency = "USD"): string {
  if (value == null) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatVolume(mt: number | null | undefined): string {
  if (mt == null) return "—"
  if (mt >= 1_000_000) return (mt / 1_000_000).toFixed(1) + "M MT"
  if (mt >= 1_000)     return (mt / 1_000).toFixed(0) + "K MT"
  return mt + " MT"
}

export function formatLeadTime(days: number | null | undefined): string {
  if (days == null) return "—"
  if (days >= 30) return Math.round(days / 30) + " mo"
  return days + "d"
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(iso))
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 65) return "Good"
  if (score >= 50) return "Fair"
  return "Poor"
}
