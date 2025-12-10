"use client";

import { useState, useRef, useEffect } from "react";
import { JobStatus } from "@/types";
import { cn, getStatusColor } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

interface StatusPickerProps {
  status: JobStatus;
  onStatusChange: (status: JobStatus) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}

export default function StatusPicker({
  status,
  onStatusChange,
  size = "sm",
  disabled = false,
}: StatusPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusClick = (e: React.MouseEvent, newStatus: JobStatus) => {
    e.stopPropagation();
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={toggleOpen}
        disabled={disabled}
        className={cn(
          "rounded-full font-medium capitalize flex items-center gap-1 transition-all",
          getStatusColor(status),
          size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
          !disabled && "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 dark:hover:ring-gray-600",
          disabled && "cursor-default"
        )}
      >
        {status}
        {!disabled && <ChevronDown className={cn("transition-transform", size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3", isOpen && "rotate-180")} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:relative sm:inset-auto">
          {/* Backdrop for mobile */}
          <div
            className="absolute inset-0 bg-black/30 sm:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Options panel */}
          <div className="relative z-10 w-full sm:w-auto sm:absolute sm:top-full sm:left-0 sm:mt-1 bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Mobile header */}
            <div className="sm:hidden p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-2" />
              <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">Change Status</p>
            </div>

            <div className="p-1 sm:p-1 max-h-[50vh] sm:max-h-none overflow-y-auto">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => handleStatusClick(e, option.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 sm:py-2 text-left transition-colors rounded-md",
                    status === option.value
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", getStatusColor(option.value))}>
                    {option.label}
                  </span>
                  {status === option.value && (
                    <Check className="w-4 h-4 text-[#1f95ea]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
