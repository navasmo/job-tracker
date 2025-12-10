"use client";

import { isDemoMode } from "@/lib/demo";

// Subtle demo indicator badge for the header
export function DemoBadge() {
  if (!isDemoMode) return null;

  return (
    <span className="text-xs font-medium text-[#1f95ea]">
      [Demo]
    </span>
  );
}

// Keep the old export for backwards compatibility but return null
export default function DemoBanner() {
  return null;
}
