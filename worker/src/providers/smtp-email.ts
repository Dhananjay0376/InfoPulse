import nodemailer from "nodemailer";

import { env } from "../config/env.js";
import type { EmailProvider, EmailSendInput, EmailSendResult } from "./types.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth:
    env.SMTP_USER && env.SMTP_PASS
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
});

export class SmtpEmailProvider implements EmailProvider {
  async send(input: EmailSendInput): Promise<EmailSendResult> {
    const result = await transporter.sendMail({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? undefined,
    });

    return {
      provider: "smtp",
      providerMessageId: result.messageId,
      acceptedAt: new Date().toISOString(),
      payload: {
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      },
    };
  }
}
