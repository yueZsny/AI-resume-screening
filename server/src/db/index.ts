import "../loadEnv.js";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!tursoUrl) {
  throw new Error(
    "TURSO_DATABASE_URL 未设置或 .env 未加载。请在 server/.env 中配置，并确保入口先执行 loadEnv（见 src/loadEnv.ts）。",
  );
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

export const db = drizzle(client, { schema });

export async function testConnection(): Promise<boolean> {
  try {
    await client.execute("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export { client };
