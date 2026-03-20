import { type Database, tables } from "@dtask/db";
import type { UserInsertModel } from "@dtask/schemas";
import { eq } from "drizzle-orm";
import { generateSecureRandomString } from "@/domains/shared/crypto";

export class UsersRepository {
  constructor(private readonly db: Database) { }

  async insert(data: UserInsertModel) {
    const [user] = await this.db
      .insert(tables.users)
      .values({ id: generateSecureRandomString(), ...data })
      .returning();
    return user;
  }

  async findById(id: string) {
    const [user] = await this.db
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, id))
      .limit(1);
    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, email))
      .limit(1);
    return user;
  }

  async findAll() {
    return this.db.select().from(tables.users);
  }

  async update(id: string, data: UserUpdateModel) {
    const [user] = await this.db
      .update(tables.users)
      .set(data)
      .where(eq(tables.users.id, id))
      .returning();
    return user;
  }

  async delete(id: string) {
    return this.db.delete(tables.users).where(eq(tables.users.id, id));
  }
}
