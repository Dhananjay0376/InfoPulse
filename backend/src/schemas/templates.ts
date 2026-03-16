import { z } from "zod";

export const templateInputSchema = z.object({
  name: z.string().min(1).max(120),
  subject: z.string().min(1).max(255),
  bodyHtml: z.string().min(1),
  bodyText: z.string().optional(),
  variables: z.array(z.string()).default([]),
});
