import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  APP_NAME: z.string().default("InfoPulse Worker"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  EMAIL_PROVIDER: z.enum(["stub", "smtp"]).default("stub"),
  EMAIL_FROM: z.string().email(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z.coerce.boolean().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.EMAIL_PROVIDER === "smtp") {
    if (!value.SMTP_HOST) {
      ctx.addIssue({ code: "custom", path: ["SMTP_HOST"], message: "SMTP_HOST is required for smtp provider" });
    }
    if (!value.SMTP_PORT) {
      ctx.addIssue({ code: "custom", path: ["SMTP_PORT"], message: "SMTP_PORT is required for smtp provider" });
    }
    if (!value.SMTP_USER) {
      ctx.addIssue({ code: "custom", path: ["SMTP_USER"], message: "SMTP_USER is required for smtp provider" });
    }
    if (!value.SMTP_PASS) {
      ctx.addIssue({ code: "custom", path: ["SMTP_PASS"], message: "SMTP_PASS is required for smtp provider" });
    }
  }
});

export const env = envSchema.parse(process.env);
