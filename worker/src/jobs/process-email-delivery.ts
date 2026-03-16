import { env } from "../config/env.js";
import { getEmailProvider } from "../providers/index.js";
import {
  createMessageDelivery,
  finalizeCampaignIfComplete,
  getCampaignRecipientForDelivery,
  markRecipientFailed,
  markRecipientProcessing,
  markRecipientSent,
} from "../repositories/deliveries.js";

export async function processEmailDelivery(campaignRecipientId: string) {
  const recipient = await getCampaignRecipientForDelivery(campaignRecipientId);

  if (!recipient) {
    throw new Error(`Campaign recipient ${campaignRecipientId} not found`);
  }

  await markRecipientProcessing(campaignRecipientId);

  try {
    const provider = getEmailProvider();
    const result = await provider.send({
      to: recipient.to,
      from: env.EMAIL_FROM,
      subject: recipient.subject,
      html: recipient.html,
      text: recipient.text,
    });

    await createMessageDelivery({
      campaignId: recipient.campaignId,
      campaignRecipientId: recipient.campaignRecipientId,
      customerId: recipient.customerId,
      provider: result.provider,
      providerMessageId: result.providerMessageId,
      payload: result.payload,
      sentAt: result.acceptedAt,
    });

    await markRecipientSent(campaignRecipientId);
    await finalizeCampaignIfComplete(recipient.campaignId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown delivery error";
    await markRecipientFailed(campaignRecipientId, message);
    await finalizeCampaignIfComplete(recipient.campaignId);
    throw error;
  }
}
