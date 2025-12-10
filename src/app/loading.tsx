import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-cairo)] text-[#1f95ea] text-4xl font-bold">nmo.</span>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
          <span className="font-[family-name:var(--font-cairo)] text-xl font-bold text-gray-900 dark:text-white">
            Job Tracker
          </span>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-[#1f95ea]" />
      </div>
    </div>
  );
}
