import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  role: z.enum(["admin", "couple"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
