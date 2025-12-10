"use client";

import { Job, JobStatus } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import JobCard from "./JobCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: JobStatus;
  title: string;
  jobs: Job[];
  onJobClick: (job: Job) => void;
  onAddJob: (status: JobStatus) => void;
  onStatusChange?: (jobId: number, status: JobStatus) => void;
  activeId: number | null;
}

const columnColors: Record<JobStatus, string> = {
  saved: "border-t-gray-400",
  applied: "border-t-blue-500",
  interviewing: "border-t-yellow-500",
  offer: "border-t-green-500",
  rejected: "border-t-red-500",
  withdrawn: "border-t-gray-500",
};

export default function KanbanColumn({
  id,
  title,
  jobs,
  onJobClick,
  onAddJob,
  onStatusChange,
  activeId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl border-t-4 flex-shrink-0 min-w-[260px] sm:min-w-[300px] w-[260px] sm:w-auto sm:flex-1 h-full",
        columnColors[id],
        isOver && "ring-2 ring-[#1f95ea] ring-opacity-50"
      )}
    >
      <div className="p-2.5 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white capitalize">
              {title}
            </h3>
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
              {jobs.length}
            </span>
          </div>
          <button
            onClick={() => onAddJob(id)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-y-auto min-h-[200px]"
      >
        <SortableContext
          items={jobs.map((job) => job.id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => onJobClick(job)}
              isDragging={activeId === job.id}
              onStatusChange={onStatusChange}
            />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500">
            <p className="text-sm">No jobs yet</p>
            <button
              onClick={() => onAddJob(id)}
              className="mt-2 text-xs text-[#1f95ea] hover:underline"
            >
              Add a job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
