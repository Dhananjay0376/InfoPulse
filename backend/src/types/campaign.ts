export interface CampaignRecord {
  id: string;
  name: string;
  channel: "email";
  templateId: string;
  status: "draft" | "scheduled" | "processing" | "completed" | "failed" | "cancelled";
  scheduledAt: string | null;
  launchedAt: string | null;
  completedAt: string | null;
  recipientCount: number;
  createdAt: string;
  updatedAt: string;
}
