export interface MessageDeliveryRecord {
  id: string;
  campaignId: string;
  campaignRecipientId: string;
  customerId: string;
  provider: string;
  providerMessageId: string | null;
  status: "queued" | "accepted" | "delivered" | "bounced" | "complained" | "failed";
  errorCode: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
