import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function checkLinks() {
  const result = await sql`SELECT company, title, link FROM jobs WHERE link IS NOT NULL LIMIT 5`;
  console.log("Jobs with links:");
  console.log(JSON.stringify(result, null, 2));

  const count = await sql`SELECT COUNT(*) as total FROM jobs WHERE link IS NOT NULL`;
  console.log(`\nTotal jobs with links: ${count[0].total}`);
}

checkLinks().catch(console.error);
