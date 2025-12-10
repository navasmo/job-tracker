"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/types";
import { cn, formatDate, getStatusColor, getWorkTypeColor } from "@/lib/utils";
import { getCompanyLogoUrl, getUIAvatarsUrl } from "@/lib/logo";
import StatusPicker from "@/components/ui/StatusPicker";
import toast from "react-hot-toast";
import {
  MapPin,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

// Platform logo component for job links
function PlatformLogo({ url }: { url: string }) {
  const hostname = new URL(url).hostname.toLowerCase();

  // LinkedIn
  if (hostname.includes("linkedin")) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    );
  }

  // Indeed
  if (hostname.includes("indeed")) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#2164f3">
        <path d="M11.566 21.5622v-8.9788c.2015.0176.403.0264.613.0264 1.5956 0 2.9523-.5635 4.0627-1.6914.1839-.1839.3502-.3766.5077-.5781v11.2219c0 .8272-.6746 1.5018-1.5018 1.5018h-2.18c-.8272 0-1.5016-.6746-1.5016-1.5018zM12.179 0c2.5086 0 4.5439 2.0353 4.5439 4.5439 0 2.5173-2.0353 4.5526-4.5439 4.5526-2.5086 0-4.5439-2.0353-4.5439-4.5526C7.6351 2.0353 9.6704 0 12.179 0z"/>
      </svg>
    );
  }

  // Glassdoor
  if (hostname.includes("glassdoor")) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0caa41">
        <path d="M17.144 20.572H6.857c-.394 0-.714-.32-.714-.715V4.143c0-.395.32-.714.714-.714h10.287c.394 0 .714.32.714.714v15.714c0 .395-.32.715-.714.715zM6.857 2.571c-.867 0-1.571.705-1.571 1.572v15.714c0 .867.704 1.572 1.571 1.572h10.287c.867 0 1.571-.705 1.571-1.572V4.143c0-.867-.704-1.572-1.571-1.572z"/>
      </svg>
    );
  }

  // Workday
  if (hostname.includes("workday") || hostname.includes("myworkday")) {
    return (
      <div className="w-4 h-4 rounded bg-[#0875e1] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">W</span>
      </div>
    );
  }

  // Greenhouse
  if (hostname.includes("greenhouse")) {
    return (
      <div className="w-4 h-4 rounded bg-[#3ab549] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">G</span>
      </div>
    );
  }

  // Lever
  if (hostname.includes("lever.co")) {
    return (
      <div className="w-4 h-4 rounded bg-[#1f2937] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">L</span>
      </div>
    );
  }

  // Reed
  if (hostname.includes("reed.co")) {
    return (
      <div className="w-4 h-4 rounded bg-[#d4145a] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">R</span>
      </div>
    );
  }

  // Totaljobs
  if (hostname.includes("totaljobs")) {
    return (
      <div className="w-4 h-4 rounded bg-[#6a0dad] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">T</span>
      </div>
    );
  }

  // Default external link icon
  return <ExternalLink className="w-4 h-4 text-gray-400" />;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

function CompanyLogo({ job }: { job: Job }) {
  const [logoError, setLogoError] = useState(false);

  const logoUrl = logoError
    ? getUIAvatarsUrl(job.company, 32)
    : job.companyLogo || getCompanyLogoUrl(job.company, job.companyDomain);

  return (
    <img
      src={logoUrl}
      alt={`${job.company} logo`}
      className="w-8 h-8 rounded-md object-contain bg-white border border-gray-100 dark:border-gray-700 flex-shrink-0"
      onError={() => setLogoError(true)}
    />
  );
}

interface ListViewProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  onStatusChange?: (jobId: number, status: JobStatus) => void;
}

export default function ListView({ jobs, onJobClick, onStatusChange }: ListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleStatusChange = async (jobId: number, newStatus: JobStatus) => {
    if (onStatusChange) {
      onStatusChange(jobId, newStatus);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, jobs.length);
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  // Reset to page 1 when items per page changes or jobs change significantly
  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-lg">No jobs found</p>
        <p className="text-sm mt-1">Add a job to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Mobile List View - Card style */}
      <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onJobClick(job)}
            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <CompanyLogo job={job} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {job.company}
                    </p>
                  </div>
                  <StatusPicker
                    status={job.status}
                    onStatusChange={(status) => handleStatusChange(job.id, status)}
                    size="sm"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {job.location && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{job.location}</span>
                    </div>
                  )}
                  {job.workType && (
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", getWorkTypeColor(job.workType))}>
                      {job.workType}
                    </span>
                  )}
                  {job.dateApplied && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(job.dateApplied)}</span>
                    </div>
                  )}
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <PlatformLogo url={job.link} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Company
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Position
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Link
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Resume
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Location
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Salary
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Applied
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedJobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => onJobClick(job)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo job={job} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {job.company}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {job.title}
                </td>
                <td className="px-4 py-3">
                  {job.link ? (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-1.5"
                      title={job.link}
                    >
                      <PlatformLogo url={job.link} />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {job.resumeUsed ? (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate max-w-[140px]" title={job.resumeUsed}>
                        {job.resumeUsed}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {job.location && (
                      <>
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {job.location}
                        </span>
                      </>
                    )}
                    {job.workType && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          getWorkTypeColor(job.workType)
                        )}
                      >
                        {job.workType}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {job.expectedSalary || "-"}
                </td>
                <td className="px-4 py-3">
                  {job.dateApplied ? (
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(job.dateApplied)}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                      getStatusColor(job.status)
                    )}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 dark:border-gray-700 gap-2 sm:gap-3">
        {/* Items per page selector - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1f95ea]"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>

        {/* Page info - compact on mobile */}
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-first sm:order-none">
          {startIndex + 1}-{endIndex} of {jobs.length}
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={cn(
              "p-1.5 sm:p-2 rounded-md transition-colors",
              currentPage === 1
                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Show fewer page numbers on mobile */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={cn(
                  "min-w-[32px] h-8 px-2 rounded-md text-sm transition-colors",
                  page === currentPage
                    ? "bg-[#1f95ea] text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Mobile: just show current page */}
          <span className="sm:hidden text-xs text-gray-600 dark:text-gray-400 px-2">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={cn(
              "p-1.5 sm:p-2 rounded-md transition-colors",
              currentPage === totalPages
                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
