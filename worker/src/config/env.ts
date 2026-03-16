import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  APP_NAME: z.string().default("InfoPulse Worker"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
