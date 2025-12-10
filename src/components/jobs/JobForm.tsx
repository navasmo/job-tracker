"use client";

import { useState, useEffect } from "react";
import { Job, JobFormData, JobStatus, WorkType } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Loader2 } from "lucide-react";

interface JobFormProps {
  job?: Job;
  onSubmit: (data: JobFormData) => Promise<void>;
  onCancel: () => void;
}

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

const workTypeOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "in-person", label: "In-Person" },
];

export default function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [loading, setLoading] = useState(false);
  const [resumeOptions, setResumeOptions] = useState<Array<{ value: string; label: string }>>([
    { value: "", label: "Select resume..." },
    { value: "custom", label: "Custom (enter below)" },
  ]);

  // Fetch unique resume names from database
  useEffect(() => {
    async function fetchResumes() {
      try {
        const response = await fetch("/api/resumes");
        if (response.ok) {
          const resumes: string[] = await response.json();
          const options = [
            { value: "", label: "Select resume..." },
            ...resumes.map(resume => ({ value: resume, label: resume })),
            { value: "custom", label: "Custom (enter below)" },
          ];
          setResumeOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      }
    }
    fetchResumes();
  }, []);

  // Check if existing resume is in the preset list
  const isCustomResume = job?.resumeUsed && !resumeOptions.some(opt => opt.value === job.resumeUsed);
  const [showCustomResume, setShowCustomResume] = useState(isCustomResume);
  const [selectedResumeOption, setSelectedResumeOption] = useState(
    isCustomResume ? "custom" : (job?.resumeUsed || "")
  );
  const [formData, setFormData] = useState<JobFormData>({
    company: job?.company || "",
    title: job?.title || "",
    link: job?.link || "",
    expectedSalary: job?.expectedSalary || "",
    location: job?.location || "",
    workType: job?.workType || "hybrid",
    dateApplied: job?.dateApplied
      ? new Date(job.dateApplied).toISOString().split("T")[0]
      : "",
    status: job?.status || "saved",
    resumeUsed: job?.resumeUsed || "",
    payRange: job?.payRange || "",
    notes: job?.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedResumeOption(value);
    if (value === "custom") {
      setShowCustomResume(true);
      setFormData((prev) => ({ ...prev, resumeUsed: "" }));
    } else {
      setShowCustomResume(false);
      setFormData((prev) => ({ ...prev, resumeUsed: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
      {/* Company & Title - always 2 columns on mobile too */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Input
          label="Company *"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Google"
          required
        />
        <Input
          label="Job Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Product Manager"
          required
        />
      </div>

      <Input
        label="Job Link"
        name="link"
        type="url"
        value={formData.link}
        onChange={handleChange}
        placeholder="https://..."
      />

      {/* Location & Work Type */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="London"
        />
        <Select
          label="Work Type"
          name="workType"
          value={formData.workType}
          onChange={handleChange}
          options={workTypeOptions}
        />
      </div>

      {/* Salary fields */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Input
          label="Expected Salary"
          name="expectedSalary"
          value={formData.expectedSalary}
          onChange={handleChange}
          placeholder="£60k"
        />
        <Input
          label="Pay Range"
          name="payRange"
          value={formData.payRange}
          onChange={handleChange}
          placeholder="£55k - £70k"
        />
      </div>

      {/* Date & Status */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Input
          label="Date Applied"
          name="dateApplied"
          type="date"
          value={formData.dateApplied}
          onChange={handleChange}
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      {/* Resume */}
      <div className="space-y-1.5">
        <Select
          label="Resume Used"
          name="resumeSelect"
          value={selectedResumeOption}
          onChange={handleResumeSelect}
          options={resumeOptions}
        />
        {showCustomResume && (
          <Input
            label=""
            name="resumeUsed"
            value={formData.resumeUsed}
            onChange={handleChange}
            placeholder="Enter custom resume name..."
          />
        )}
      </div>

      {/* Notes */}
      <div className="w-full">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1f95ea] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 transition-colors duration-200"
          placeholder="Add any notes..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : job ? (
            "Update"
          ) : (
            "Add Job"
          )}
        </Button>
      </div>
    </form>
  );
}
