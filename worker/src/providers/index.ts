import { env } from "../config/env.js";
import { SmtpEmailProvider } from "./smtp-email.js";
import { StubEmailProvider } from "./stub-email.js";
import type { EmailProvider } from "./types.js";

export function getEmailProvider(): EmailProvider {
  switch (env.EMAIL_PROVIDER) {
    case "smtp":
      return new SmtpEmailProvider();
    case "stub":
    default:
      return new StubEmailProvider();
  }
}
