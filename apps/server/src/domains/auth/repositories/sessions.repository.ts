import { type Database, tables } from "@dtask/db";
import type { SessionInsertModel } from "@dtask/schemas";
import { eq } from "drizzle-orm";

export class SessionsRepository {
  constructor(private readonly db: Database) { }

  async insert(data: SessionInsertModel) {
    const [session] = await this.db
      .insert(tables.sessions)
      .values(data)
      .returning();
    return session;
  }

  async findById(id: string) {
    const [session] = await this.db
      .select()
      .from(tables.sessions)
      .where(eq(tables.sessions.id, id))
      .limit(1);
    return session;
  }

  async findByIdWithUser(id: string) {
    const [result] = await this.db
      .select()
      .from(tables.sessions)
      .innerJoin(tables.users, eq(tables.sessions.userId, tables.users.id))
      .where(eq(tables.sessions.id, id))
      .limit(1);
    return result;
  }

  async delete(id: string) {
    return this.db.delete(tables.sessions).where(eq(tables.sessions.id, id));
  }

  async deleteAllByUserId(userId: string) {
    return this.db
      .delete(tables.sessions)
      .where(eq(tables.sessions.userId, userId));
  }
}
