import { db, jobs } from "@/lib/db";
import { desc } from "drizzle-orm";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

async function getJobs() {
  try {
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.updatedAt));
    return allJobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function Home() {
  const allJobs = await getJobs();

  return <Dashboard initialJobs={allJobs} />;
}
