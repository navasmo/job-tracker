import { NextRequest, NextResponse } from "next/server";
import { db, jobs, activities } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.updatedAt));
    return NextResponse.json(allJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newJob = await db.insert(jobs).values({
      company: body.company,
      title: body.title,
      link: body.link || null,
      expectedSalary: body.expectedSalary || null,
      location: body.location || null,
      workType: body.workType || "hybrid",
      dateApplied: body.dateApplied ? new Date(body.dateApplied) : null,
      status: body.status || "saved",
      resumeUsed: body.resumeUsed || null,
      payRange: body.payRange || null,
      notes: body.notes || null,
      priority: body.priority || 0,
    }).returning();

    // Log activity
    await db.insert(activities).values({
      jobId: newJob[0].id,
      type: "job_created",
      description: `Job application for ${body.title} at ${body.company} created`,
    });

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
