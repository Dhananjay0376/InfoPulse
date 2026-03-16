import { z } from "zod";

export const campaignInputSchema = z.object({
  name: z.string().min(1).max(200),
  templateId: z.string().uuid(),
  scheduledAt: z.string().datetime().optional(),
});
