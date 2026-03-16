export const CAMPAIGN_LAUNCH_QUEUE = "campaign-launch";
export const EMAIL_DELIVERY_QUEUE = "email-delivery";

export interface CampaignLaunchJobData {
  campaignId: string;
  launchedBy: string;
}

export interface EmailDeliveryJobData {
  campaignId: string;
  campaignRecipientId: string;
}
