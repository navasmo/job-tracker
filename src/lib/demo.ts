// Demo mode utilities
// When NEXT_PUBLIC_DEMO_MODE is true, all changes are local-only (session-based)
// and don't persist to the database

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Generate a temporary ID for demo mode
let tempIdCounter = 1000;
export const generateTempId = () => {
  tempIdCounter += 1;
  return tempIdCounter;
};
