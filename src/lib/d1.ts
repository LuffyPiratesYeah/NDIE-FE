import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDB() {
  const ctx = getCloudflareContext();
  const db = (ctx?.env as { DB?: D1Database }).DB;

  if (!db) {
    throw new Error("D1 binding 'DB' is missing. Make sure wrangler.jsonc has a d1_databases entry.");
  }

  return db;
}
