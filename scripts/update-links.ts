import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

// Links extracted from spreadsheet hyperlinks
const jobLinks: { company: string; title: string; link: string }[] = [
  { company: "Siena AI", title: "Associate Product Manager", link: "https://www.linkedin.com/jobs/view/4305166068" },
  { company: "Viator(Tripadvisor)", title: "Associate Product Manager - Operator Experience", link: "https://www.linkedin.com/jobs/view/4294251256" },
  { company: "AxiumAI", title: "AI Product Specialist", link: "https://www.linkedin.com/jobs/view/4302942961" },
  { company: "Google", title: "Associate Product Marketing Manager", link: "https://www.linkedin.com/jobs/view/4304302788" },
  { company: "Turnitin", title: "Product Manager", link: "https://www.linkedin.com/jobs/view/4266799367" },
  { company: "Chelsea Football Club", title: "Digital Product Manager", link: "https://www.linkedin.com/jobs/view/4310710550" },
  { company: "Deblock", title: "Product Owner - Jnr/Mid", link: "https://www.linkedin.com/jobs/view/4305718812" },
  { company: "Xtremepush", title: "Product Owner - Jnr/Mid", link: "https://www.linkedin.com/jobs/view/4310720776" },
  { company: "Attio", title: "Product Specialist", link: "https://www.linkedin.com/jobs/view/4312818145" },
  { company: "WPP", title: "Product Owner, WPP Open", link: "https://www.linkedin.com/jobs/view/4311893342" },
  { company: "WPP", title: "AI Product Manager, Production, WPP Open", link: "https://www.linkedin.com/jobs/view/4300681680" },
  { company: "Stream", title: "Product Manager", link: "https://www.linkedin.com/jobs/view/4315023208" },
  { company: "Propel (Recruiter)", title: "Junior Product Manager", link: "https://www.linkedin.com/jobs/view/4314623333" },
  { company: "Lloyds Banking Group", title: "Product Owner", link: "https://www.linkedin.com/jobs/view/4315226570" },
  { company: "Urban Jungle Insurance", title: "Product Manager", link: "https://www.linkedin.com/jobs/view/4313226096" },
  { company: "Moss", title: "AI Automation Manager", link: "https://www.linkedin.com/jobs/view/4316316796" },
  { company: "Microsoft", title: "Product Manager", link: "https://www.linkedin.com/jobs/view/4317537564" },
  { company: "BlackRock", title: "Digital Product Manager (Associate)", link: "https://www.linkedin.com/jobs/view/4331188401" },
  { company: "Capital on Tap", title: "Associate Product Manager", link: "https://www.linkedin.com/jobs/view/4334379172" },
  { company: "Google", title: "Associate Product Manager, Early Careers, 2026 Start", link: "https://www.linkedin.com/jobs/view/4321931887" },
  { company: "Experis UK", title: "Product Manager - AI / StartUp", link: "https://www.linkedin.com/jobs/view/4318624451" },
  { company: "Sogeti", title: "AI - Product Manager", link: "https://www.linkedin.com/jobs/view/4337189092" },
  { company: "BT Group", title: "Associate Product Manager, Broadband In-life", link: "https://www.linkedin.com/jobs/view/4341369723" },
  { company: "Fremantle UK", title: "Product Manager, AI", link: "https://www.linkedin.com/jobs/view/4339366102" },
];

// Handle Siena AI separately (two entries with same company/title but different dates)
const sienaAINov = { company: "Siena AI", title: "Associate Product Manager", link: "https://www.linkedin.com/jobs/view/4339229721", dateApplied: "2025-11-30" };

async function updateLinks() {
  console.log("🔗 Updating job links...");

  for (const job of jobLinks) {
    const result = await sql`
      UPDATE jobs
      SET link = ${job.link}, updated_at = NOW()
      WHERE company = ${job.company} AND title = ${job.title}
    `;
    console.log(`Updated: ${job.company} - ${job.title}`);
  }

  // Update the November Siena AI entry specifically
  await sql`
    UPDATE jobs
    SET link = ${sienaAINov.link}, updated_at = NOW()
    WHERE company = ${sienaAINov.company}
      AND title = ${sienaAINov.title}
      AND date_applied >= '2025-11-01'
  `;
  console.log(`Updated: Siena AI - Associate Product Manager (Nov)`);

  console.log("✅ Links updated successfully!");
}

updateLinks().catch((error) => {
  console.error("❌ Update failed:", error);
  process.exit(1);
});
