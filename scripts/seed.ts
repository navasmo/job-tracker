import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

// Sample job data with real companies and diverse roles
const sampleJobs = [
  {
    company: "Spotify",
    title: "Senior Software Engineer",
    link: "https://www.linkedin.com/company/spotify/jobs/",
    expectedSalary: "£95k",
    payRange: "£85k - £110k",
    location: "London",
    workType: "hybrid",
    dateApplied: "2025-01-15",
    status: "interviewing",
    resumeUsed: "Resume-2025-v1",
    notes: "Technical phone screen completed. On-site scheduled for next week."
  },
  {
    company: "Revolut",
    title: "Product Designer",
    link: "https://www.revolut.com/careers/",
    expectedSalary: "£75k",
    payRange: "£70k - £85k",
    location: "London",
    workType: "hybrid",
    dateApplied: "2025-01-18",
    status: "applied",
    resumeUsed: "Resume-2025-v2",
    notes: "Applied via company website. Portfolio submitted."
  },
  {
    company: "Deliveroo",
    title: "Data Scientist",
    link: "https://www.linkedin.com/company/deliveroo/jobs/",
    expectedSalary: "£80k",
    location: "London",
    workType: "remote",
    dateApplied: "2025-01-20",
    status: "rejected",
    resumeUsed: "Resume-2025-v1",
    notes: "Feedback: Looking for more ML experience."
  },
  {
    company: "Monzo",
    title: "Backend Engineer",
    link: "https://monzo.com/careers/",
    expectedSalary: "£85k",
    payRange: "£75k - £95k",
    location: "London",
    workType: "hybrid",
    dateApplied: "2025-01-22",
    status: "offer",
    resumeUsed: "Resume-2025-v2",
    notes: "Offer received! £88k base + equity. Decision deadline: Feb 5th."
  },
  {
    company: "Canva",
    title: "UX Researcher",
    link: "https://www.canva.com/careers/",
    expectedSalary: "£70k",
    location: "Remote",
    workType: "remote",
    dateApplied: "2025-01-25",
    status: "interviewing",
    resumeUsed: "Resume-2025-v1",
    notes: "Completed case study presentation. Final round next week."
  },
  {
    company: "Stripe",
    title: "Full Stack Developer",
    link: "https://stripe.com/jobs",
    expectedSalary: "£110k",
    payRange: "£100k - £130k",
    location: "Dublin",
    workType: "hybrid",
    dateApplied: "2025-02-01",
    status: "saved",
    resumeUsed: "Resume-2025-v2",
    notes: "Preparing application. Need to tailor cover letter."
  },
  {
    company: "Wise",
    title: "Frontend Engineer",
    link: "https://www.linkedin.com/company/wiseuk/jobs/",
    expectedSalary: "£78k",
    location: "London",
    workType: "hybrid",
    dateApplied: "2025-02-03",
    status: "applied",
    resumeUsed: "Resume-2025-v1",
    notes: "Referral from former colleague."
  },
  {
    company: "Figma",
    title: "Product Manager",
    link: "https://www.figma.com/careers/",
    expectedSalary: "£95k",
    payRange: "£90k - £115k",
    location: "London",
    workType: "hybrid",
    dateApplied: "2025-02-05",
    status: "withdrawn",
    resumeUsed: "Resume-2025-v2",
    notes: "Withdrew after accepting Monzo offer."
  },
  {
    company: "Notion",
    title: "Solutions Engineer",
    link: "https://www.linkedin.com/company/notionhq/jobs/",
    expectedSalary: "£82k",
    location: "Remote",
    workType: "remote",
    dateApplied: "2025-02-08",
    status: "applied",
    resumeUsed: "Resume-2025-v1",
    notes: "Interesting role combining technical and customer-facing skills."
  },
  {
    company: "Klarna",
    title: "Engineering Manager",
    link: "https://www.klarna.com/careers/",
    expectedSalary: "£120k",
    payRange: "£110k - £140k",
    location: "Stockholm",
    workType: "hybrid",
    dateApplied: "2025-02-10",
    status: "interviewing",
    resumeUsed: "Resume-2025-v2",
    notes: "Hiring manager call completed. Technical loop scheduled."
  },
  {
    company: "Shopify",
    title: "DevOps Engineer",
    link: "https://www.linkedin.com/company/shopify/jobs/",
    expectedSalary: "£90k",
    location: "Remote",
    workType: "remote",
    dateApplied: "2025-02-12",
    status: "applied",
    resumeUsed: "Resume-2025-v1",
    notes: "Remote-first company. Good work-life balance reviews."
  },
  {
    company: "Airbnb",
    title: "iOS Developer",
    link: "https://careers.airbnb.com/",
    expectedSalary: "£100k",
    payRange: "£95k - £120k",
    location: "London",
    workType: "hybrid",
    dateApplied: "2025-02-14",
    status: "saved",
    resumeUsed: "Resume-2025-v2",
    notes: "Researching team structure before applying."
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Create tables
  await sql`
    DO $$ BEGIN
      CREATE TYPE job_status AS ENUM ('saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;

  await sql`
    DO $$ BEGIN
      CREATE TYPE work_type AS ENUM ('remote', 'hybrid', 'in-person');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      link TEXT,
      company_logo TEXT,
      company_domain TEXT,
      expected_salary VARCHAR(100),
      location VARCHAR(255),
      work_type work_type DEFAULT 'hybrid',
      date_applied TIMESTAMP,
      status job_status DEFAULT 'saved' NOT NULL,
      resume_used VARCHAR(255),
      pay_range VARCHAR(100),
      current_salary VARCHAR(100),
      offer_amount VARCHAR(100),
      notes TEXT,
      priority INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS interviews (
      id SERIAL PRIMARY KEY,
      job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
      interview_number INTEGER NOT NULL,
      person VARCHAR(255),
      date_time TIMESTAMP,
      completed BOOLEAN DEFAULT FALSE,
      follow_up_sent BOOLEAN DEFAULT FALSE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  console.log("✅ Tables created");

  // Insert sample jobs
  for (const job of sampleJobs) {
    await sql`
      INSERT INTO jobs (company, title, link, expected_salary, pay_range, location, work_type, date_applied, status, resume_used, notes)
      VALUES (
        ${job.company},
        ${job.title},
        ${job.link || null},
        ${job.expectedSalary || null},
        ${job.payRange || null},
        ${job.location || null},
        ${(job.workType as "remote" | "hybrid" | "in-person") || "hybrid"},
        ${job.dateApplied ? new Date(job.dateApplied) : null},
        ${(job.status as "applied" | "rejected" | "interviewing" | "offer" | "saved" | "withdrawn") || "applied"},
        ${job.resumeUsed || null},
        ${job.notes || null}
      )
    `;
  }

  console.log(`✅ Inserted ${sampleJobs.length} sample jobs`);
  console.log("🎉 Seeding complete!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
