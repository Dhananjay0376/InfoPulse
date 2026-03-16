import { db } from "../db.js";

export interface DeliveryRecipientRecord {
  campaignId: string;
  campaignRecipientId: string;
  customerId: string;
  to: string;
  subject: string;
  html: string;
  text: string | null;
}

function mapRecipient(row: Record<string, unknown>): DeliveryRecipientRecord {
  return {
    campaignId: String(row.campaign_id),
    campaignRecipientId: String(row.id),
    customerId: String(row.customer_id),
    to: String(row.resolved_email),
    subject: String(row.rendered_subject ?? ""),
    html: String(row.rendered_body_html ?? ""),
    text: row.rendered_body_text ? String(row.rendered_body_text) : null,
  };
}

export async function getCampaignRecipientForDelivery(campaignRecipientId: string) {
  const result = await db.query(
    `SELECT id, campaign_id, customer_id, resolved_email, rendered_subject, rendered_body_html, rendered_body_text
     FROM campaign_recipients
     WHERE id = $1
     LIMIT 1`,
    [campaignRecipientId]
  );

  return result.rows[0] ? mapRecipient(result.rows[0]) : null;
}

export async function markRecipientProcessing(campaignRecipientId: string) {
  await db.query(
    `UPDATE campaign_recipients
     SET status = 'processing'
     WHERE id = $1`,
    [campaignRecipientId]
  );
}

export async function markRecipientSent(campaignRecipientId: string) {
  await db.query(
    `UPDATE campaign_recipients
     SET status = 'sent', processed_at = NOW()
     WHERE id = $1`,
    [campaignRecipientId]
  );
}

export async function markRecipientFailed(campaignRecipientId: string, reason: string) {
  await db.query(
    `UPDATE campaign_recipients
     SET status = 'failed', failure_reason = $2, processed_at = NOW()
     WHERE id = $1`,
    [campaignRecipientId, reason]
  );
}

export async function createMessageDelivery(input: {
  campaignId: string;
  campaignRecipientId: string;
  customerId: string;
  provider: string;
  providerMessageId: string;
  payload: Record<string, unknown>;
  sentAt: string;
}) {
  await db.query(
    `INSERT INTO message_deliveries (
       campaign_id,
       campaign_recipient_id,
       customer_id,
       provider,
       provider_message_id,
       status,
       provider_payload,
       sent_at,
       created_at,
       updated_at
     ) VALUES ($1, $2, $3, $4, $5, 'accepted', $6::jsonb, $7, NOW(), NOW())`,
    [
      input.campaignId,
      input.campaignRecipientId,
      input.customerId,
      input.provider,
      input.providerMessageId,
      JSON.stringify(input.payload),
      input.sentAt,
    ]
  );
}

export async function finalizeCampaignIfComplete(campaignId: string) {
  const result = await db.query(
    `SELECT COUNT(*)::int AS pending_count
     FROM campaign_recipients
     WHERE campaign_id = $1 AND status IN ('queued', 'processing')`,
    [campaignId]
  );

  const pendingCount = Number(result.rows[0]?.pending_count ?? 0);

  if (pendingCount === 0) {
    await db.query(
      `UPDATE campaigns
       SET status = 'completed', completed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [campaignId]
    );
  }
}
