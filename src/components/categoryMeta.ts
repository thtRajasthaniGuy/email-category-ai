// eCommerce-focused category meta
export const CATEGORY_META: Record<
  string,
  { label: string; icon: string; badge: string }
> = {
  "order":            { label: "Order",          icon: "📦", badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  "return":           { label: "Return",         icon: "↩️", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  "refund":           { label: "Refund",         icon: "💸", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  "fraud":            { label: "Fraud Alert",    icon: "🚨", badge: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  "urgent-support":   { label: "Urgent Support", icon: "⏱️", badge: "bg-purple-50 text-purple-700 ring-1 ring-purple-200" },
  "other":            { label: "Other",          icon: "📥", badge: "bg-slate-50 text-slate-700 ring-1 ring-slate-200" },
  "uncategorized":    { label: "Uncategorized",  icon: "🏷️", badge: "bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200" },
};

export function getCategoryMeta(raw?: string) {
  const key = (raw || "other").toLowerCase();
  return CATEGORY_META[key] ?? CATEGORY_META["other"];
}
