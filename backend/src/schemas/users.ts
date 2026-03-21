import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(200),
  role: z.enum(["admin", "sender", "viewer"]),
});

export const updateUserSchema = z.object({
  role: z.enum(["admin", "sender", "viewer"]),
  isActive: z.boolean(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8),
});
