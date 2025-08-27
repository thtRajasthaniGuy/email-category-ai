// lib/categories.ts
export interface CategoryMeta {
  label: string;
  icon: string;
  badge: string;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  // --- General / normal user categories ---
  "work":        { label: "Work",       icon: "💼", badge: "bg-slate-50 text-slate-700 ring-1 ring-slate-200" },
  "personal":    { label: "Personal",   icon: "🏠", badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200" },
  "finance":     { label: "Finance",    icon: "💰", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  "social":      { label: "Social",     icon: "👥", badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" },
  "travel":      { label: "Travel",     icon: "✈️", badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" },
  "health":      { label: "Health",     icon: "🩺", badge: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  "education":   { label: "Education",  icon: "📚", badge: "bg-orange-50 text-orange-700 ring-1 ring-orange-200" },
  "newsletters": { label: "Newsletters",icon: "📰", badge: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" },
  "shopping":    { label: "Shopping",   icon: "🛍️", badge: "bg-pink-50 text-pink-700 ring-1 ring-pink-200" },

  // --- E-commerce / B2B specific categories ---
  "order":            { label: "Order",          icon: "📦", badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  "return":           { label: "Return",         icon: "↩️", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  "refund":           { label: "Refund",         icon: "💸", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  "fraud":            { label: "Fraud Alert",    icon: "🚨", badge: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  "urgent-support":   { label: "Urgent Support", icon: "⏱️", badge: "bg-purple-50 text-purple-700 ring-1 ring-purple-200" },
  "shipment":         { label: "Shipment",       icon: "🚚", badge: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200" },
  "invoice":          { label: "Invoice",        icon: "🧾", badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" },
  "payment":          { label: "Payment",        icon: "💳", badge: "bg-pink-50 text-pink-700 ring-1 ring-pink-200" },
  "vendor":           { label: "Vendor",         icon: "🏭", badge: "bg-slate-50 text-slate-700 ring-1 ring-slate-200" },
  "partnership":      { label: "Partnership",    icon: "🤝", badge: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  "promotion":        { label: "Promotion",      icon: "🎯", badge: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" },
  "contract":         { label: "Contract",       icon: "📑", badge: "bg-orange-50 text-orange-700 ring-1 ring-orange-200" },
  "support":          { label: "Support",        icon: "🛠️", badge: "bg-teal-50 text-teal-700 ring-1 ring-teal-200" },

  // --- Catch-alls ---
  "other":            { label: "Other",          icon: "📥", badge: "bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200" },
  "uncategorized":    { label: "Uncategorized",  icon: "🏷️", badge: "bg-gray-50 text-gray-700 ring-1 ring-gray-200" },
};

export function getCategoryMeta(raw?: string): { key: string; meta: CategoryMeta } {
  const key = (raw || "other").toLowerCase();
  const meta = CATEGORY_META[key] ?? CATEGORY_META["other"];
  return { key, meta };
}
