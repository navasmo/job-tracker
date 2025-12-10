import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

// Known company domain mappings
const KNOWN_DOMAINS: Record<string, string> = {
  "google": "google.com",
  "microsoft": "microsoft.com",
  "apple": "apple.com",
  "amazon": "amazon.com",
  "meta": "meta.com",
  "facebook": "facebook.com",
  "netflix": "netflix.com",
  "spotify": "spotify.com",
  "linkedin": "linkedin.com",
  "uber": "uber.com",
  "airbnb": "airbnb.com",
  "stripe": "stripe.com",
  "slack": "slack.com",
  "salesforce": "salesforce.com",
  "adobe": "adobe.com",
  "oracle": "oracle.com",
  "ibm": "ibm.com",
  "paypal": "paypal.com",
  "dropbox": "dropbox.com",
  "atlassian": "atlassian.com",
  "github": "github.com",
  "notion": "notion.so",
  "figma": "figma.com",
  "canva": "canva.com",
  "hubspot": "hubspot.com",
  "twilio": "twilio.com",
  "datadog": "datadoghq.com",
  "snowflake": "snowflake.com",
  "mongodb": "mongodb.com",
  "cloudflare": "cloudflare.com",
  "vercel": "vercel.com",
  "supabase": "supabase.com",
  "openai": "openai.com",
  "anthropic": "anthropic.com",
  // UK-specific companies
  "bt group": "bt.com",
  "bt": "bt.com",
  "lloyds banking group": "lloydsbank.com",
  "lloyds": "lloydsbank.com",
  "barclays": "barclays.co.uk",
  "hsbc": "hsbc.co.uk",
  "natwest": "natwest.com",
  "virgin media": "virginmedia.com",
  "sky": "sky.com",
  "bbc": "bbc.co.uk",
  "itv": "itv.com",
  "tesco": "tesco.com",
  "sainsburys": "sainsburys.co.uk",
  "sainsbury's": "sainsburys.co.uk",
  "asos": "asos.com",
  "deliveroo": "deliveroo.co.uk",
  "just eat": "just-eat.co.uk",
  "monzo": "monzo.com",
  "revolut": "revolut.com",
  "wise": "wise.com",
  "starling": "starlingbank.com",
  "starling bank": "starlingbank.com",
  "chelsea football club": "chelseafc.com",
  // Companies from the job list
  "siena ai": "siena.cx",
  "viator": "viator.com",
  "viator(tripadvisor)": "viator.com",
  "tripadvisor": "tripadvisor.com",
  "axiumai": "axium.ai",
  "attio": "attio.com",
  "stream": "getstream.io",
  "moss": "getmoss.com",
  "blackrock": "blackrock.com",
  "capital on tap": "capitalontap.com",
  "fremantle": "fremantle.com",
  "fremantle uk": "fremantle.com",
  "wpp": "wpp.com",
  "turnitin": "turnitin.com",
  "deblock": "deblock.com",
  "xtremepush": "xtremepush.com",
  "urban jungle": "ujinsurance.co.uk",
  "urban jungle insurance": "ujinsurance.co.uk",
  "sogeti": "sogeti.com",
  "experis": "experis.com",
  "experis uk": "experis.com",
  "propel": "propel.me",
  "propel (recruiter)": "propel.me",
};

function guessDomain(companyName: string): string | null {
  const normalized = companyName.toLowerCase().trim();

  // Check known domains first (exact match)
  if (KNOWN_DOMAINS[normalized]) {
    return KNOWN_DOMAINS[normalized];
  }

  // Check partial matches
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return domain;
    }
  }

  // Try to construct a domain from the company name
  const cleaned = normalized
    .replace(/\s*\(.*?\)\s*/g, "") // Remove parenthetical content
    .replace(/\s*(ltd|limited|inc|incorporated|corp|corporation|llc|plc|group|uk|us|international|global)\.?\s*$/gi, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "");

  if (cleaned.length > 2) {
    return `${cleaned}.com`;
  }

  return null;
}

async function updateCompanyDomains() {
  console.log("🔄 Updating company domains...\n");

  // Get all jobs
  const jobs = await sql`SELECT id, company, company_domain FROM jobs`;

  let updated = 0;
  for (const job of jobs) {
    // Skip if already has a domain
    if (job.company_domain) {
      console.log(`⏭️  ${job.company} - already has domain: ${job.company_domain}`);
      continue;
    }

    const domain = guessDomain(job.company);
    if (domain) {
      await sql`UPDATE jobs SET company_domain = ${domain}, updated_at = NOW() WHERE id = ${job.id}`;
      console.log(`✅ ${job.company} -> ${domain}`);
      updated++;
    } else {
      console.log(`❓ ${job.company} - could not determine domain`);
    }
  }

  console.log(`\n✅ Updated ${updated} jobs with company domains`);
}

updateCompanyDomains().catch(console.error);
