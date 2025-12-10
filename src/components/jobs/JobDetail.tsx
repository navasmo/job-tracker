"use client";

import { Job } from "@/types";
import { cn, formatDate, getStatusColor, getWorkTypeColor } from "@/lib/utils";
import Button from "@/components/ui/Button";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  FileText,
  Briefcase,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";

interface JobDetailProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function JobDetail({
  job,
  onEdit,
  onDelete,
  onClose,
}: JobDetailProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job application?")) {
      onDelete();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
            {job.title}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-base sm:text-lg truncate">{job.company}</span>
          </div>
        </div>
        <span
          className={cn(
            "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium capitalize text-xs sm:text-sm flex-shrink-0",
            getStatusColor(job.status)
          )}
        >
          {job.status}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {job.location && (
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>
              <p className="text-gray-900 dark:text-white">{job.location}</p>
            </div>
          </div>
        )}

        {job.workType && (
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Work Type
              </p>
              <span
                className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-sm",
                  getWorkTypeColor(job.workType)
                )}
              >
                {job.workType}
              </span>
            </div>
          </div>
        )}

        {job.expectedSalary && (
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expected Salary
              </p>
              <p className="text-gray-900 dark:text-white">
                {job.expectedSalary}
              </p>
            </div>
          </div>
        )}

        {job.payRange && (
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pay Range
              </p>
              <p className="text-gray-900 dark:text-white">{job.payRange}</p>
            </div>
          </div>
        )}

        {job.dateApplied && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date Applied
              </p>
              <p className="text-gray-900 dark:text-white">
                {formatDate(job.dateApplied)}
              </p>
            </div>
          </div>
        )}

        {job.resumeUsed && (
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resume Used
              </p>
              <p className="text-gray-900 dark:text-white">{job.resumeUsed}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated
            </p>
            <p className="text-gray-900 dark:text-white">
              {formatDate(job.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Job Link */}
      {job.link && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Job Posting
          </h3>
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#1f95ea] hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View Job Posting
          </a>
        </div>
      )}

      {/* Notes */}
      {job.notes && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Notes
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            {job.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="danger" onClick={handleDelete} className="w-full sm:w-auto">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Close
          </Button>
          <Button onClick={onEdit} className="flex-1 sm:flex-none">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
