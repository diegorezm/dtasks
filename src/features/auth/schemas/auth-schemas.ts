import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z.string().min(8).max(128);

export const signInSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const signUpSchema = signInSchema.extend({
	name: z.string().trim().min(1).max(100),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
