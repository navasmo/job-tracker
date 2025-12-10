import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function addLogoColumns() {
  console.log("Adding company_logo and company_domain columns...");

  try {
    // Add company_logo column if it doesn't exist
    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS company_logo TEXT
    `;
    console.log("Added company_logo column");

    // Add company_domain column if it doesn't exist
    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS company_domain VARCHAR(255)
    `;
    console.log("Added company_domain column");

    console.log("Migration complete!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addLogoColumns();
