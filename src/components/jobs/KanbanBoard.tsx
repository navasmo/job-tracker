"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { Job, JobStatus, JobFormData } from "@/types";
import KanbanColumn from "./KanbanColumn";
import JobCard from "./JobCard";
import JobForm from "./JobForm";
import JobDetail from "./JobDetail";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { isDemoMode, generateTempId } from "@/lib/demo";

const columns: { id: JobStatus; title: string }[] = [
  { id: "saved", title: "Saved" },
  { id: "applied", title: "Applied" },
  { id: "interviewing", title: "Interviewing" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
  { id: "withdrawn", title: "Withdrawn" },
];

interface KanbanBoardProps {
  initialJobs: Job[];
}

export default function KanbanBoard({ initialJobs }: KanbanBoardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<JobStatus>("saved");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getJobsByStatus = (status: JobStatus): Job[] => {
    return jobs.filter((job) => job.status === status);
  };

  const [originalStatus, setOriginalStatus] = useState<JobStatus | null>(null);

  // Helper to find the target column from an over ID (could be column or job card)
  const findTargetColumn = (overId: string | number): JobStatus | null => {
    // Check if it's a column directly
    const column = columns.find((col) => col.id === overId);
    if (column) return column.id;

    // Check if it's a job card - find the job and return its status (column)
    const overJob = jobs.find((job) => job.id === overId);
    if (overJob) return overJob.status;

    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeJob = jobs.find((job) => job.id === active.id);
    const targetColumn = findTargetColumn(over.id);

    if (activeJob && targetColumn && activeJob.status !== targetColumn) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === activeJob.id ? { ...job, status: targetColumn } : job
        )
      );
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeJob = jobs.find((job) => job.id === event.active.id);
    if (activeJob) {
      setOriginalStatus(activeJob.status);
    }
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      // Dropped outside - revert to original status
      if (originalStatus) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === active.id ? { ...job, status: originalStatus } : job
          )
        );
      }
      setOriginalStatus(null);
      return;
    }

    const activeJob = jobs.find((job) => job.id === active.id);
    const targetColumn = findTargetColumn(over.id);
    const targetColumnData = columns.find((col) => col.id === targetColumn);

    if (activeJob && targetColumn && targetColumnData) {
      // Only make API call if status actually changed
      if (originalStatus !== targetColumn) {
        // Demo mode: local-only operations
        if (isDemoMode) {
          toast.success(`Moved to ${targetColumnData.title} (demo mode)`);
          setOriginalStatus(null);
          return;
        }

        // Production mode: API calls
        try {
          const response = await fetch(`/api/jobs/${activeJob.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: targetColumn }),
          });

          if (!response.ok) throw new Error("Failed to update job status");

          toast.success(`Moved to ${targetColumnData.title}`);
        } catch (error) {
          // Revert the change
          if (originalStatus) {
            setJobs((prev) =>
              prev.map((job) =>
                job.id === activeJob.id
                  ? { ...job, status: originalStatus }
                  : job
              )
            );
          }
          toast.error("Failed to update job status");
        }
      }
    }
    setOriginalStatus(null);
  };

  const handleAddJob = (status: JobStatus) => {
    setDefaultStatus(status);
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleSubmitJob = async (data: JobFormData) => {
    // Demo mode: local-only operations
    if (isDemoMode) {
      if (editingJob) {
        const updatedJob: Job = {
          ...editingJob,
          ...data,
          dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
          updatedAt: new Date(),
        };
        setJobs((prev) =>
          prev.map((job) => (job.id === editingJob.id ? updatedJob : job))
        );
        toast.success("Job updated (demo mode)");
      } else {
        const newJob: Job = {
          id: generateTempId(),
          company: data.company,
          title: data.title,
          link: data.link || null,
          companyLogo: null,
          companyDomain: null,
          expectedSalary: data.expectedSalary || null,
          location: data.location || null,
          workType: data.workType || "hybrid",
          dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
          status: defaultStatus,
          resumeUsed: data.resumeUsed || null,
          payRange: data.payRange || null,
          currentSalary: null,
          offerAmount: null,
          notes: data.notes || null,
          priority: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setJobs((prev) => [newJob, ...prev]);
        toast.success("Job added (demo mode)");
      }
      setIsFormOpen(false);
      setEditingJob(null);
      return;
    }

    // Production mode: API calls
    try {
      if (editingJob) {
        const response = await fetch(`/api/jobs/${editingJob.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update job");

        const updatedJob = await response.json();
        setJobs((prev) =>
          prev.map((job) => (job.id === editingJob.id ? updatedJob : job))
        );
        toast.success("Job updated successfully");
      } else {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, status: defaultStatus }),
        });

        if (!response.ok) throw new Error("Failed to create job");

        const newJob = await response.json();
        setJobs((prev) => [newJob, ...prev]);
        toast.success("Job added successfully");
      }

      setIsFormOpen(false);
      setEditingJob(null);
    } catch (error) {
      toast.error(editingJob ? "Failed to update job" : "Failed to add job");
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    // Demo mode: local-only operations
    if (isDemoMode) {
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setIsDetailOpen(false);
      setSelectedJob(null);
      toast.success("Job deleted (demo mode)");
      return;
    }

    // Production mode: API calls
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete job");

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setIsDetailOpen(false);
      setSelectedJob(null);
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleStatusChange = async (jobId: number, newStatus: JobStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    const oldStatus = job.status;

    // Optimistically update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    // Demo mode: local-only operations
    if (isDemoMode) {
      const targetColumnData = columns.find((col) => col.id === newStatus);
      toast.success(`Moved to ${targetColumnData?.title || newStatus} (demo mode)`);
      return;
    }

    // Production mode: API calls
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const targetColumnData = columns.find((col) => col.id === newStatus);
      toast.success(`Moved to ${targetColumnData?.title || newStatus}`);
    } catch (error) {
      // Revert on error
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: oldStatus } : j))
      );
      toast.error("Failed to update status");
    }
  };

  const activeJob = jobs.find((job) => job.id === activeId);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] px-1 sm:px-0">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              jobs={getJobsByStatus(column.id)}
              onJobClick={handleJobClick}
              onAddJob={handleAddJob}
              onStatusChange={handleStatusChange}
              activeId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeJob ? (
            <div className="rotate-3 opacity-90">
              <JobCard job={activeJob} onClick={() => {}} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? "Edit Job Application" : "Add Job Application"}
        size="lg"
      >
        <JobForm
          job={editingJob || undefined}
          onSubmit={handleSubmitJob}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingJob(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedJob(null);
        }}
        title="Job Details"
        size="xl"
      >
        {selectedJob && (
          <JobDetail
            job={selectedJob}
            onEdit={() => handleEditJob(selectedJob)}
            onDelete={() => handleDeleteJob(selectedJob.id)}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedJob(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
