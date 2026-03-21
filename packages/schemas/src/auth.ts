import { tables } from "@dtask/db";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import { z } from "zod";

export const userInsertSchema = createInsertSchema(tables.users, {
	name: z.string().min(1),
	email: z.email(),
	passwordHash: z.string().min(1),
	emailVerified: z.boolean().optional(),
	image: z.string().optional(),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const userUpdateSchema = createUpdateSchema(tables.users, {
	name: z.string().min(1).optional(),
	email: z.email().optional(),
	passwordHash: z.string().min(1).optional(),
	emailVerified: z.boolean().optional(),
	image: z.string().optional(),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const registerSchema = userInsertSchema
	.pick({
		name: true,
		email: true,
	})
	.extend({
		password: z.string().min(6),
	});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;

export type SessionModel = typeof tables.sessions.$inferSelect;
export type SessionInsertModel = typeof tables.sessions.$inferInsert;

export type UserInsertModel = z.infer<typeof userInsertSchema>;
export type UserUpdateModel = z.infer<typeof userUpdateSchema>;
export type UserModel = typeof tables.users.$inferSelect;
