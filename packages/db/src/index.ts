import { env } from "@dtask/env/server";
import { drizzle } from "drizzle-orm/d1";
import { tables } from "./schema";

export const db = drizzle(env.DB, { schema: tables });
