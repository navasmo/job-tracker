export type JobStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn";
export type WorkType = "remote" | "hybrid" | "in-person";

export interface Job {
  id: number;
  company: string;
  title: string;
  link: string | null;
  companyLogo: string | null;
  companyDomain: string | null;
  expectedSalary: string | null;
  location: string | null;
  workType: WorkType | null;
  dateApplied: Date | null;
  status: JobStatus;
  resumeUsed: string | null;
  payRange: string | null;
  currentSalary: string | null;
  offerAmount: string | null;
  notes: string | null;
  priority: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: number;
  jobId: number;
  interviewNumber: number;
  person: string | null;
  dateTime: Date | null;
  completed: boolean | null;
  followUpSent: boolean | null;
  notes: string | null;
  createdAt: Date;
}

export interface Activity {
  id: number;
  jobId: number;
  type: string;
  description: string;
  createdAt: Date;
}

export interface JobWithInterviews extends Job {
  interviews?: Interview[];
}

export interface KanbanColumn {
  id: JobStatus;
  title: string;
  jobs: Job[];
}

export interface JobFormData {
  company: string;
  title: string;
  link?: string;
  expectedSalary?: string;
  location?: string;
  workType?: WorkType;
  dateApplied?: string;
  status: JobStatus;
  resumeUsed?: string;
  payRange?: string;
  notes?: string;
}
