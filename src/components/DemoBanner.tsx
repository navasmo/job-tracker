"use client";

import { isDemoMode } from "@/lib/demo";
import { Info } from "lucide-react";

export default function DemoBanner() {
  if (!isDemoMode) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-center gap-2 text-amber-800 dark:text-amber-200">
          <Info className="w-4 h-4 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-center">
            <span className="font-medium">Demo Mode:</span> Feel free to add jobs and drag cards around – your changes are session-only and won't be saved.
          </p>
        </div>
      </div>
    </div>
  );
}
