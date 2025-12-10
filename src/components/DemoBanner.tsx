"use client";

import { isDemoMode } from "@/lib/demo";

// Subtle demo indicator badge for the header
export function DemoBadge() {
  if (!isDemoMode) return null;

  return (
    <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
      Demo
    </span>
  );
}

// Keep the old export for backwards compatibility but return null
export default function DemoBanner() {
  return null;
}
