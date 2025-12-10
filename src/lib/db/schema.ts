import { pgTable, serial, text, timestamp, varchar, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const jobStatusEnum = pgEnum("job_status", [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
]);

export const workTypeEnum = pgEnum("work_type", [
  "remote",
  "hybrid",
  "in-person",
]);

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  link: text("link"),
  companyLogo: text("company_logo"),
  companyDomain: varchar("company_domain", { length: 255 }),
  expectedSalary: varchar("expected_salary", { length: 100 }),
  location: varchar("location", { length: 255 }),
  workType: workTypeEnum("work_type").default("hybrid"),
  dateApplied: timestamp("date_applied"),
  status: jobStatusEnum("status").default("saved").notNull(),
  resumeUsed: varchar("resume_used", { length: 255 }),
  payRange: varchar("pay_range", { length: 100 }),
  currentSalary: varchar("current_salary", { length: 100 }),
  offerAmount: varchar("offer_amount", { length: 100 }),
  notes: text("notes"),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "cascade" }).notNull(),
  interviewNumber: integer("interview_number").notNull(),
  person: varchar("person", { length: 255 }),
  dateTime: timestamp("date_time"),
  completed: boolean("completed").default(false),
  followUpSent: boolean("follow_up_sent").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // status_change, note_added, interview_scheduled, etc.
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
