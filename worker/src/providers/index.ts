import { env } from "../config/env.js";
import { StubEmailProvider } from "./stub-email.js";
import type { EmailProvider } from "./types.js";

export function getEmailProvider(): EmailProvider {
  switch (env.EMAIL_PROVIDER) {
    case "stub":
    default:
      return new StubEmailProvider();
  }
}
