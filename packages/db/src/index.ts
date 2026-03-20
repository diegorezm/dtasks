import { env } from "@dtask/env/server";
import { drizzle } from "drizzle-orm/d1";
import { tables } from "./schema";

const db = drizzle(env.DB, { schema: tables });
type Database = typeof db;

export type { Database };
export { db, tables };
