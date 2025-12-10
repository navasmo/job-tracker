"use client";

import { useState, useMemo } from "react";
import { Job, JobFormData, JobStatus } from "@/types";
import Header from "./Header";
import DemoBanner from "./DemoBanner";
import StatsBar from "./StatsBar";
import KanbanBoard from "./jobs/KanbanBoard";
import ListView from "./jobs/ListView";
import JobForm from "./jobs/JobForm";
import JobDetail from "./jobs/JobDetail";
import Modal from "./ui/Modal";
import toast from "react-hot-toast";
import { isDemoMode, generateTempId } from "@/lib/demo";

export type DateFilterType = "all" | "today" | "week" | "month" | "custom";

interface DashboardProps {
  initialJobs: Job[];
}

export default function Dashboard({ initialJobs }: DashboardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  // Default to list view on mobile, kanban on desktop
  const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "list";
    }
    return "kanban";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Helper to get the effective date for sorting/filtering (dateApplied or createdAt)
  const getJobDate = (job: Job): Date => {
    return job.dateApplied ? new Date(job.dateApplied) : new Date(job.createdAt);
  };

  // Filter by date range
  const filterByDate = (job: Job): boolean => {
    if (dateFilter === "all") return true;

    const jobDate = getJobDate(job);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case "today":
        return jobDate >= startOfToday;
      case "week": {
        const weekAgo = new Date(startOfToday);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return jobDate >= weekAgo;
      }
      case "month": {
        const monthAgo = new Date(startOfToday);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return jobDate >= monthAgo;
      }
      case "custom": {
        if (!customDateRange.start && !customDateRange.end) return true;
        const startDate = customDateRange.start ? new Date(customDateRange.start) : new Date(0);
        const endDate = customDateRange.end
          ? new Date(new Date(customDateRange.end).setHours(23, 59, 59, 999))
          : new Date();
        return jobDate >= startDate && jobDate <= endDate;
      }
      default:
        return true;
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(query) ||
          job.title.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
      );
    }

    // Apply date filter
    result = result.filter(filterByDate);

    // Sort by date (most recent first)
    result = [...result].sort((a, b) => {
      const dateA = getJobDate(a);
      const dateB = getJobDate(b);
      return dateB.getTime() - dateA.getTime();
    });

    return result;
  }, [jobs, searchQuery, dateFilter, customDateRange]);

  const handleAddJob = () => {
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
          status: data.status || "saved",
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
          body: JSON.stringify(data),
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
    // Demo mode: local-only operations
    if (isDemoMode) {
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: newStatus, updatedAt: new Date() } : job))
      );
      toast.success(`Status updated to ${newStatus} (demo mode)`);
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

      const updatedJob = await response.json();
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updatedJob : job))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <DemoBanner />
      <Header
        onAddJob={handleAddJob}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customDateRange={customDateRange}
        onCustomDateRangeChange={setCustomDateRange}
      />

      <StatsBar jobs={jobs} />

      <main className="w-full px-2 sm:px-6 lg:px-8 py-3 sm:py-6">
        {viewMode === "kanban" ? (
          <KanbanBoard initialJobs={filteredAndSortedJobs} />
        ) : (
          <ListView jobs={filteredAndSortedJobs} onJobClick={handleJobClick} onStatusChange={handleStatusChange} />
        )}
      </main>

      {/* Add/Edit Job Modal (for list view) */}
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

      {/* Job Detail Modal (for list view) */}
      <Modal
        isOpen={isDetailOpen && viewMode === "list"}
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
    </div>
  );
}
