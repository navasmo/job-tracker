// Company logo fetching utility
// Uses multiple providers with fallbacks

// Known company domain mappings for common companies
const KNOWN_DOMAINS: Record<string, string> = {
  "google": "google.com",
  "microsoft": "microsoft.com",
  "apple": "apple.com",
  "amazon": "amazon.com",
  "meta": "meta.com",
  "facebook": "facebook.com",
  "netflix": "netflix.com",
  "spotify": "spotify.com",
  "twitter": "twitter.com",
  "x": "x.com",
  "linkedin": "linkedin.com",
  "uber": "uber.com",
  "airbnb": "airbnb.com",
  "stripe": "stripe.com",
  "shopify": "shopify.com",
  "slack": "slack.com",
  "zoom": "zoom.us",
  "salesforce": "salesforce.com",
  "adobe": "adobe.com",
  "oracle": "oracle.com",
  "ibm": "ibm.com",
  "intel": "intel.com",
  "cisco": "cisco.com",
  "nvidia": "nvidia.com",
  "paypal": "paypal.com",
  "dropbox": "dropbox.com",
  "atlassian": "atlassian.com",
  "github": "github.com",
  "gitlab": "gitlab.com",
  "notion": "notion.so",
  "figma": "figma.com",
  "canva": "canva.com",
  "hubspot": "hubspot.com",
  "mailchimp": "mailchimp.com",
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
  "marks & spencer": "marksandspencer.com",
  "m&s": "marksandspencer.com",
  "boots": "boots.com",
  "asos": "asos.com",
  "deliveroo": "deliveroo.co.uk",
  "just eat": "just-eat.co.uk",
  "monzo": "monzo.com",
  "revolut": "revolut.com",
  "wise": "wise.com",
  "transferwise": "wise.com",
  "starling": "starlingbank.com",
  "starling bank": "starlingbank.com",
  "chelsea football club": "chelseafc.com",
  "arsenal": "arsenal.com",
  "manchester united": "manutd.com",
  "tottenham": "tottenhamhotspur.com",
  // Tech companies
  "siena ai": "siena.cx",
  "viator": "viator.com",
  "tripadvisor": "tripadvisor.com",
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
  "axiumai": "axium.ai",
};

/**
 * Attempts to guess a company's domain from its name
 */
export function guessDomain(companyName: string): string | null {
  const normalized = companyName.toLowerCase().trim();

  // Check known domains first
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
  // Remove common suffixes and clean up
  const cleaned = normalized
    .replace(/\s*(ltd|limited|inc|incorporated|corp|corporation|llc|plc|group|uk|us|international|global)\.?\s*$/gi, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "");

  if (cleaned.length > 2) {
    return `${cleaned}.com`;
  }

  return null;
}

/**
 * Get Clearbit logo URL (free, high quality)
 */
export function getClearbitLogoUrl(domain: string, size: number = 128): string {
  return `https://logo.clearbit.com/${domain}?size=${size}`;
}

/**
 * Get Logo.dev URL (free, reliable alternative)
 */
export function getLogoDevUrl(domain: string): string {
  return `https://img.logo.dev/${domain}?token=pk_X-FQ7dtaQ3SD2rNlHWKFfQ`;
}

/**
 * Get Google favicon URL (reliable fallback)
 */
export function getGoogleFaviconUrl(domain: string, size: number = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Get UI Avatars URL (generated initials - final fallback)
 */
export function getUIAvatarsUrl(name: string, size: number = 128): string {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Generate a consistent color based on the name
  const colors = [
    "1f95ea", // Primary blue
    "10b981", // Green
    "f59e0b", // Amber
    "ef4444", // Red
    "8b5cf6", // Purple
    "ec4899", // Pink
    "06b6d4", // Cyan
  ];

  const colorIndex = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${bgColor}&color=fff&bold=true&format=svg`;
}

/**
 * Get the best available logo URL for a company
 */
export function getCompanyLogoUrl(companyName: string, companyDomain?: string | null): string {
  const domain = companyDomain || guessDomain(companyName);

  if (domain) {
    // Use Google Favicon service (most reliable)
    return getGoogleFaviconUrl(domain, 128);
  }

  // Fallback to generated avatar
  return getUIAvatarsUrl(companyName);
}

/**
 * Check if a logo URL is valid (returns 200)
 */
export async function checkLogoUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get a verified logo URL with fallbacks
 */
export async function getVerifiedLogoUrl(companyName: string, companyDomain?: string | null): Promise<string> {
  const domain = companyDomain || guessDomain(companyName);

  if (domain) {
    // Try Clearbit first
    const clearbitUrl = getClearbitLogoUrl(domain);
    if (await checkLogoUrl(clearbitUrl)) {
      return clearbitUrl;
    }

    // Try Google favicon
    const googleUrl = getGoogleFaviconUrl(domain);
    if (await checkLogoUrl(googleUrl)) {
      return googleUrl;
    }
  }

  // Final fallback to generated avatar
  return getUIAvatarsUrl(companyName);
}
