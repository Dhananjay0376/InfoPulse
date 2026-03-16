import { z } from "zod";

export const customerInputSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  dob: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  notes: z.string().max(2000).optional(),
  emailOptIn: z.boolean().default(true),
});
