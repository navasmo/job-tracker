import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatSalary(salary: string | null): string {
  if (!salary) return "Not specified";
  return salary;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "applied":
      return "status-applied";
    case "interviewing":
      return "status-interviewing";
    case "offer":
      return "status-offer";
    case "rejected":
      return "status-rejected";
    case "saved":
      return "status-saved";
    case "withdrawn":
      return "status-withdrawn";
    default:
      return "status-saved";
  }
}

export function getWorkTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "remote":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "hybrid":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "in-person":
    case "onsite":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}
