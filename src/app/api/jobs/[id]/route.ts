import { NextRequest, NextResponse } from "next/server";
import { db, jobs, activities, interviews } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    const job = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

    if (!job.length) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const jobInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.jobId, jobId))
      .orderBy(interviews.interviewNumber);

    return NextResponse.json({ ...job[0], interviews: jobInterviews });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);
    const body = await request.json();

    // Get the current job to check for status changes
    const currentJob = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

    if (!currentJob.length) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // Only include fields that are provided
    if (body.company !== undefined) updateData.company = body.company;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.link !== undefined) updateData.link = body.link;
    if (body.expectedSalary !== undefined) updateData.expectedSalary = body.expectedSalary;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.workType !== undefined) updateData.workType = body.workType;
    if (body.dateApplied !== undefined) updateData.dateApplied = body.dateApplied ? new Date(body.dateApplied) : null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.resumeUsed !== undefined) updateData.resumeUsed = body.resumeUsed;
    if (body.payRange !== undefined) updateData.payRange = body.payRange;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.priority !== undefined) updateData.priority = body.priority;

    const updatedJob = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, jobId))
      .returning();

    // Log status change activity
    if (body.status && body.status !== currentJob[0].status) {
      await db.insert(activities).values({
        jobId: jobId,
        type: "status_change",
        description: `Status changed from "${currentJob[0].status}" to "${body.status}"`,
      });
    }

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    await db.delete(jobs).where(eq(jobs.id, jobId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
