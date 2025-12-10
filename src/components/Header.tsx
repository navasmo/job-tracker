"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Plus, LayoutGrid, List, Search, Calendar, ChevronDown, X, LogOut, Loader2, SlidersHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import { DateFilterType } from "./Dashboard";
import { DemoBadge } from "./DemoBanner";

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Separate component for user menu that uses useUser hook
function UserMenu() {
  // Only import and use Stack Auth when not in demo mode
  if (isDemo) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useUser } = require("@stackframe/stack");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user = useUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userMenuRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await user?.signOut();
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#1f95ea] flex items-center justify-center text-white font-medium text-sm">
          {user.displayName?.[0]?.toUpperCase() || user.primaryEmail?.[0]?.toUpperCase() || "U"}
        </div>
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.primaryEmail}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenuFallback() {
  if (isDemo) return null;
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
    </div>
  );
}

interface HeaderProps {
  onAddJob: () => void;
  viewMode: "kanban" | "list";
  onViewModeChange: (mode: "kanban" | "list") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  customDateRange: { start: string; end: string };
  onCustomDateRangeChange: (range: { start: string; end: string }) => void;
}

const dateFilterOptions: { value: DateFilterType; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

export default function Header({
  onAddJob,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  customDateRange,
  onCustomDateRangeChange,
}: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const dateFilterRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setIsDateFilterOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentFilterLabel = dateFilterOptions.find((opt) => opt.value === dateFilter)?.label;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-[family-name:var(--font-cairo)] text-[#1f95ea] text-xl sm:text-2xl font-bold">nmo.</span>
            <DemoBadge />
            <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-gray-600" />
            <span className="hidden sm:block font-[family-name:var(--font-cairo)] text-lg font-bold text-gray-900 dark:text-white">
              Job Tracker
            </span>
          </div>

          {/* Search and Date Filter */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1f95ea] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            {/* Date Filter Dropdown */}
            <div className="relative" ref={dateFilterRef}>
              <button
                onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1f95ea] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm whitespace-nowrap">{currentFilterLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDateFilterOpen ? "rotate-180" : ""}`} />
              </button>

              {isDateFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-2">
                    {dateFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onDateFilterChange(option.value);
                          if (option.value !== "custom") {
                            setIsDateFilterOpen(false);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          dateFilter === option.value
                            ? "bg-[#1f95ea] text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Range Inputs */}
                  {dateFilter === "custom" && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => onCustomDateRangeChange({ ...customDateRange, start: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1f95ea]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => onCustomDateRangeChange({ ...customDateRange, end: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1f95ea]"
                        />
                      </div>
                      {(customDateRange.start || customDateRange.end) && (
                        <button
                          onClick={() => {
                            onCustomDateRangeChange({ start: "", end: "" });
                          }}
                          className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <X className="w-3 h-3" />
                          Clear dates
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search/Filter Toggle */}
            <div className="md:hidden relative" ref={mobileSearchRef}>
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isMobileSearchOpen || searchQuery || dateFilter !== "all"
                    ? "bg-[#1f95ea]/10 text-[#1f95ea]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
                aria-label="Search and filter"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>

              {/* Mobile Search/Filter Dropdown */}
              {isMobileSearchOpen && (
                <div className="fixed left-2 right-2 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-3 space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1f95ea] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                  </div>

                  {/* Date Filter Options */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Date Applied</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {dateFilterOptions.filter(opt => opt.value !== "custom").map((option) => (
                        <button
                          key={option.value}
                          onClick={() => onDateFilterChange(option.value)}
                          className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            dateFilter === option.value
                              ? "bg-[#1f95ea] text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Date Range */}
                  <div>
                    <button
                      onClick={() => onDateFilterChange("custom")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        dateFilter === "custom"
                          ? "bg-[#1f95ea] text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      Custom Range
                    </button>
                    {dateFilter === "custom" && (
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => onCustomDateRangeChange({ ...customDateRange, start: e.target.value })}
                            className="flex-1 px-2 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1f95ea]"
                          />
                          <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => onCustomDateRangeChange({ ...customDateRange, end: e.target.value })}
                            className="flex-1 px-2 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1f95ea]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || dateFilter !== "all") && (
                    <button
                      onClick={() => {
                        onSearchChange("");
                        onDateFilterChange("all");
                        onCustomDateRangeChange({ start: "", end: "" });
                      }}
                      className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* View Toggle - Now visible on mobile */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 sm:p-1">
              <button
                onClick={() => onViewModeChange("kanban")}
                className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label="Kanban view"
              >
                <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            )}

            {/* Add Job Button - Icon only on mobile */}
            <Button onClick={onAddJob} className="!p-2 sm:!px-4 sm:!py-2">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Job</span>
            </Button>

            {/* User Menu - Only shown when not in demo mode */}
            {!isDemo && (
              <Suspense fallback={<UserMenuFallback />}>
                <UserMenu />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
