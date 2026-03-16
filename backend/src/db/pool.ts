import { Pool } from "pg";

import { env } from "../config/env.js";

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function checkDatabaseConnection() {
  const client = await db.connect();

  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}
