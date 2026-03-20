import { z } from "zod";
import { userInsertSchema } from "./users.model";

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
