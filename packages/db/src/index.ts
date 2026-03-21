import { drizzle } from "drizzle-orm/d1";
import { tables } from "./schema";

export function createDatabase(d1: D1Database) {
	return drizzle(d1, { schema: tables });
}

export type Database = ReturnType<typeof createDatabase>;
export { tables };
