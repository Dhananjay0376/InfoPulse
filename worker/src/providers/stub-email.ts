import type { EmailProvider, EmailSendInput, EmailSendResult } from "./types.js";

export class StubEmailProvider implements EmailProvider {
  async send(input: EmailSendInput): Promise<EmailSendResult> {
    const acceptedAt = new Date().toISOString();
    const providerMessageId = crypto.randomUUID();

    console.log(`Stub email sent to ${input.to} with subject ${input.subject}`);

    return {
      provider: "stub",
      providerMessageId,
      acceptedAt,
      payload: {
        to: input.to,
        from: input.from,
        subject: input.subject,
      },
    };
  }
}
