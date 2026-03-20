import type { tables } from "@dtask/db";

export type SessionModel = typeof tables.sessions.$inferSelect;
export type SessionInsertModel = typeof tables.sessions.$inferInsert;
