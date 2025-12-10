import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Handle missing DATABASE_URL during build time
const connectionString = process.env.DATABASE_URL;

let sql: NeonQueryFunction<boolean, boolean>;
let db: NeonHttpDatabase<typeof schema>;

if (connectionString) {
  sql = neon(connectionString);
  db = drizzle(sql, { schema });
} else {
  // Create a dummy db that will error on actual use
  // This allows the build to complete without a DATABASE_URL
  sql = (() => {
    throw new Error("DATABASE_URL is not set");
  }) as unknown as NeonQueryFunction<boolean, boolean>;
  db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get() {
      throw new Error("DATABASE_URL is not set");
    },
  });
}

export { db };
export * from "./schema";
