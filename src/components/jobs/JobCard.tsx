"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/types";
import { cn, formatDate, getStatusColor, getWorkTypeColor } from "@/lib/utils";
import { getCompanyLogoUrl, getUIAvatarsUrl } from "@/lib/logo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StatusPicker from "@/components/ui/StatusPicker";
import {
  MapPin,
  Calendar,
  ExternalLink,
  GripVertical,
  DollarSign,
  FileText,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  isDragging?: boolean;
  onStatusChange?: (jobId: number, status: JobStatus) => void;
}

export default function JobCard({ job, onClick, isDragging, onStatusChange }: JobCardProps) {
  const [logoError, setLogoError] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get logo URL - use stored logo, or generate one
  const logoUrl = logoError
    ? getUIAvatarsUrl(job.company)
    : job.companyLogo || getCompanyLogoUrl(job.company, job.companyDomain);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "job-card bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-4 cursor-pointer group",
        isDragging && "opacity-50 shadow-lg ring-2 ring-[#1f95ea]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-opacity cursor-grab active:cursor-grabbing hidden sm:block"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Logo, Title, Company and Link */}
          <div className="flex items-start gap-3">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <img
                src={logoUrl}
                alt={`${job.company} logo`}
                className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-100 dark:border-gray-700"
                onError={() => setLogoError(true)}
              />
            </div>

            {/* Title and Company */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                {job.title}
              </h3>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {job.company}
              </div>
            </div>

            {/* External Link */}
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-[#1f95ea]" />
              </a>
            )}
          </div>

          {/* Location and Work Type */}
          <div className="flex flex-col gap-1.5">
            {job.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span>{job.location}</span>
              </div>
            )}
            {job.workType && (
              <div className="flex items-center">
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full inline-block",
                    getWorkTypeColor(job.workType)
                  )}
                >
                  {job.workType}
                </span>
              </div>
            )}
          </div>

          {/* Salary and Resume */}
          {(job.expectedSalary || job.resumeUsed) && (
            <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
              {job.expectedSalary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 flex-shrink-0" />
                  <span>{job.expectedSalary}</span>
                </div>
              )}
              {job.resumeUsed && (
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate" title={job.resumeUsed}>{job.resumeUsed}</span>
                </div>
              )}
            </div>
          )}

          {/* Status and Date */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            {/* Mobile: clickable status picker, Desktop: static pill */}
            <div className="sm:hidden">
              <StatusPicker
                status={job.status}
                onStatusChange={(status) => onStatusChange?.(job.id, status)}
                size="sm"
                disabled={!onStatusChange}
              />
            </div>
            <span
              className={cn(
                "hidden sm:inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize",
                getStatusColor(job.status)
              )}
            >
              {job.status}
            </span>

            {job.dateApplied && (
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Calendar className="w-2.5 h-2.5" />
                <span className="whitespace-nowrap">{formatDate(job.dateApplied)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
