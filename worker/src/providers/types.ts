export interface EmailSendInput {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string | null;
}

export interface EmailSendResult {
  provider: string;
  providerMessageId: string;
  acceptedAt: string;
  payload: Record<string, unknown>;
}

export interface EmailProvider {
  send(input: EmailSendInput): Promise<EmailSendResult>;
}
