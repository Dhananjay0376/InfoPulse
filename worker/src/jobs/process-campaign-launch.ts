import { db } from "../db.js";
import { emailDeliveryQueue } from "../queue/email-delivery.js";

export async function processCampaignLaunch(campaignId: string) {
  const recipientsResult = await db.query(
    `SELECT id
     FROM campaign_recipients
     WHERE campaign_id = $1 AND status = 'queued'
     ORDER BY queued_at ASC`,
    [campaignId]
  );

  if (recipientsResult.rows.length === 0) {
    await db.query(
      `UPDATE campaigns
       SET status = 'completed', completed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [campaignId]
    );

    return 0;
  }

  await emailDeliveryQueue.addBulk(
    recipientsResult.rows.map((row) => ({
      name: "deliver-email" as const,
      data: {
        campaignId,
        campaignRecipientId: String(row.id),
      },
      opts: {
        jobId: `email-delivery:${String(row.id)}`,
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    }))
  );

  return recipientsResult.rows.length;
}
