import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get unique, non-null resume names from the database
    const result = await db
      .selectDistinct({ resumeUsed: jobs.resumeUsed })
      .from(jobs)
      .where(sql`${jobs.resumeUsed} IS NOT NULL AND ${jobs.resumeUsed} != ''`)
      .orderBy(jobs.resumeUsed);

    const resumes = result
      .map((row) => row.resumeUsed)
      .filter((resume): resume is string => !!resume);

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
