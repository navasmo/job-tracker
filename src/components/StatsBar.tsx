"use client";

import { Job } from "@/types";
import {
  Bookmark,
  Send,
  MessageSquare,
  Trophy,
  XCircle,
  LogOut,
  TrendingUp,
} from "lucide-react";

interface StatsBarProps {
  jobs: Job[];
}

export default function StatsBar({ jobs }: StatsBarProps) {
  const stats = {
    saved: jobs.filter((j) => j.status === "saved").length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interviewing: jobs.filter((j) => j.status === "interviewing").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    withdrawn: jobs.filter((j) => j.status === "withdrawn").length,
    total: jobs.length,
  };

  const responseRate = stats.total > 0
    ? Math.round(((stats.interviewing + stats.offer) / stats.total) * 100)
    : 0;

  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: TrendingUp,
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-100 dark:bg-gray-800",
    },
    {
      label: "Saved",
      value: stats.saved,
      icon: Bookmark,
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-100 dark:bg-gray-800",
    },
    {
      label: "Applied",
      value: stats.applied,
      icon: Send,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Interviewing",
      value: stats.interviewing,
      icon: MessageSquare,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      label: "Offers",
      value: stats.offer,
      icon: Trophy,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-2 sm:py-4">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide">
          {statItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg ${item.bg} min-w-fit`}
            >
              <item.icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${item.color}`} />
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {item.label}
                </p>
                <p className={`text-sm sm:text-lg font-semibold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* Response Rate */}
          <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 min-w-fit ml-auto">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 sm:border-4 border-purple-500 flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-bold text-purple-600 dark:text-purple-400">
                {responseRate}%
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Response Rate
              </p>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {stats.interviewing + stats.offer} responses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
